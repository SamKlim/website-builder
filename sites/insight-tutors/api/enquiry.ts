import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const TO_EMAIL = 'insighttutorstutoring@gmail.com';

// Resend's sandbox sender only delivers to the Resend account owner's address.
// Once insighttutors.com.au is verified in Resend, switch this to
// 'Insight Tutors <enquiries@insighttutors.com.au>'.
const FROM_EMAIL = 'onboarding@resend.dev';

// Resend endpoint used only to confirm the API key is still accepted.
// Reading domains sends no mail and costs nothing.
const RESEND_PROBE_URL = 'https://api.resend.com/domains';
const RESEND_PROBE_TIMEOUT_MS = 5000;

/** Escapes user input before it is interpolated into the notification email's HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Liveness probe for an external monitor. Exercises everything a real enquiry
 * depends on — the function loading, the route resolving, the Resend credential
 * being valid — without emailing anyone.
 *
 * Distinguishes definite failures from transient ones on purpose. A rejected API
 * key means real enquiries are failing right now and must raise an alarm. Resend
 * merely being unreachable for five seconds must not, because a monitor that cries
 * wolf gets muted, and a muted monitor is what cost nine weeks of enquiries.
 */
async function handleHealthcheck(body: Record<string, string>, res: VercelResponse) {
  const expectedToken = process.env.HEALTHCHECK_TOKEN;
  if (!expectedToken) {
    console.error('[healthcheck] HEALTHCHECK_TOKEN is not configured');
    return res.status(503).json({ success: false, check: 'token_missing' });
  }
  if (body.token !== expectedToken) {
    return res.status(401).json({ success: false, check: 'token_invalid' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[healthcheck] RESEND_API_KEY is not set');
    return res.status(503).json({ success: false, check: 'resend_key_missing' });
  }

  try {
    const probe = await fetch(RESEND_PROBE_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(RESEND_PROBE_TIMEOUT_MS),
    });
    if (probe.status === 401 || probe.status === 403) {
      console.error('[healthcheck] Resend rejected the API key with', probe.status);
      return res.status(503).json({ success: false, check: 'resend_key_rejected' });
    }
  } catch (error) {
    // Could not reach Resend at all. The handler itself is healthy, so report
    // success and let the 'degraded' marker carry the detail.
    console.warn('[healthcheck] Resend unreachable (treated as transient):', error);
    return res.status(200).json({ success: true, check: 'degraded' });
  }

  return res.status(200).json({ success: true, check: 'ok' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await handleEnquiry(req, res);
  } catch (err) {
    // Surfaces in Vercel's function logs. Replaced by Sentry once the DSN is set.
    console.error('[enquiry] Unhandled error:', err);
    return res.status(500).json({ success: false, message: 'Unexpected server error.' });
  }
}

async function handleEnquiry(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  const body = (req.body ?? {}) as Record<string, string>;

  // Checked before field validation: a healthcheck carries no enquiry details.
  if (body.type === 'healthcheck') {
    return await handleHealthcheck(body, res);
  }

  const { type, name, student_name, mobile, email, grade, subjects, tutor_preference, availability, referral_source } = body;

  if (!name?.trim() || !student_name?.trim() || !mobile?.trim()) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const isPartial = type === 'partial';
  const subject = isPartial ? 'New enquiry: contact details' : 'New enquiry: full details';

  const rows: [string, string][] = isPartial
    ? [
        ['Parent name', name],
        ['Student name', student_name],
        ['Mobile', mobile],
        ['Email', email || 'Not provided'],
      ]
    : [
        ['Parent name', name],
        ['Student name', student_name],
        ['Mobile', mobile],
        ['Email', email || 'Not provided'],
        ['Year level', grade || 'Not provided'],
        ['Subjects', subjects || 'Not provided'],
        ['Tutor preference', tutor_preference || 'No preference'],
        ['Availability', availability || 'Not provided'],
        ['Found us via', referral_source || 'Not provided'],
      ];

  const html = `
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:500px">
      ${rows.map(([label, value]) => `
        <tr>
          <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:40%;border-bottom:1px solid #e5e5e5">${label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5">${escapeHtml(value)}</td>
        </tr>`).join('')}
    </table>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to: TO_EMAIL, subject, html });

  if (error) {
    // 502: our code ran fine, the upstream email provider rejected the send.
    // Distinguishing this from a 500 makes the Vercel logs readable at a glance.
    console.error('[enquiry] Resend send failed:', error.name, '-', error.message);
    return res.status(502).json({
      success: false,
      message: 'We could not send your enquiry just now. Please call or text 0426 719 991.',
    });
  }

  return res.status(200).json({ success: true });
}
