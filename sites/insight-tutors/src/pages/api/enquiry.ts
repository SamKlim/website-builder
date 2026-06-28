import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const TO_EMAIL = 'samanthaklimovski@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev';

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  let body: Record<string, string>;
  try {
    body = await request.json() as Record<string, string>;
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid request body.' }), { status: 400 });
  }

  const { type, name, student_name, mobile, email, grade, subjects, tutor_preference, availability, referral_source } = body;

  if (!name?.trim() || !student_name?.trim() || !mobile?.trim()) {
    return new Response(JSON.stringify({ success: false, message: 'Missing required fields.' }), { status: 400 });
  }

  const isPartial = type === 'partial';
  const subject = isPartial ? 'New enquiry: contact details' : 'New enquiry: full details';

  const rows = isPartial
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

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject,
    html,
  });

  if (error) {
    return new Response(JSON.stringify({ success: false, message: 'Failed to send email.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
