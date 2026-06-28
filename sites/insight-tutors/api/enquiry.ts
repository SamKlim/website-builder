import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const TO_EMAIL = 'insighttutorstutoring@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5">${value}</td>
        </tr>`).join('')}
    </table>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to: TO_EMAIL, subject, html });

  if (error) {
    return res.status(500).json({ success: false, message: error.message, name: error.name });
  }

  return res.status(200).json({ success: true });
}
