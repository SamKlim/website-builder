import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const TO_EMAIL = 'insighttutorstutoring@gmail.com';

// Resend's sandbox sender only delivers to the Resend account owner's address.
// Once insighttutors.com.au is verified in Resend, switch this to
// 'Insight Tutors <enquiries@insighttutors.com.au>'.
const FROM_EMAIL = 'onboarding@resend.dev';

/** Escapes user input before it is interpolated into the notification email's HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

  const body = req.body as Record<string, string>;
  const { type, name, student_name, mobile, email, grade, subjects, tutor_preference, availability, referral_source } = body ?? {};

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
