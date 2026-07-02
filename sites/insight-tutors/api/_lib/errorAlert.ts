import { Resend } from 'resend';

const TO_EMAIL = 'insighttutorstutoring@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev';
const RATE_LIMIT_WINDOW_MS = 30 * 60 * 1000;

const lastAlertSentAt = new Map<string, number>();

function isWithinRateLimitWindow(errorKey: string): boolean {
  const lastSent = lastAlertSentAt.get(errorKey);
  return lastSent !== undefined && Date.now() - lastSent < RATE_LIMIT_WINDOW_MS;
}

export async function alertOnError(source: string, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  const errorKey = `${source}:${message}`;

  if (isWithinRateLimitWindow(errorKey)) {
    return;
  }
  lastAlertSentAt.set(errorKey, Date.now());

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Site error: ${source}`,
      html: `<p><strong>Source:</strong> ${source}</p><p><strong>Error:</strong> ${message}</p>`,
    });
  } catch {
    // Best-effort alert — a failure here must not surface to the caller.
  }
}
