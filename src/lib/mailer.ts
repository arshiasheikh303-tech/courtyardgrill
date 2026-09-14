import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM = process.env.EMAIL_FROM || "Courtyard Grill <reservations@courtyardgrill.pk>";

export async function sendReservationConfirmation(to: string, details: {
  name: string;
  date: string;
  time: string;
  guests: number;
}) {
  if (!resend) {
    console.warn("[mailer] RESEND_API_KEY not set — skipping email send.");
    return { skipped: true };
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Your reservation at Courtyard Grill",
      html: `
        <div style="font-family: sans-serif; background:#1C1815; color:#EFE8DB; padding:32px;">
          <h2 style="color:#D4A24C;">Reservation Received</h2>
          <p>Hi ${details.name}, thanks for booking a table at Courtyard Grill.</p>
          <p><strong>Date:</strong> ${details.date}<br/>
          <strong>Time:</strong> ${details.time}<br/>
          <strong>Guests:</strong> ${details.guests}</p>
          <p>We'll confirm your table shortly. See you soon!</p>
        </div>
      `,
    });
    return { skipped: false };
  } catch (err) {
    console.error("[mailer] Failed to send reservation email:", err);
    return { skipped: true, error: true };
  }
}

export async function sendOrderConfirmation(to: string, details: {
  name: string;
  orderNumber: string;
  total: number;
}) {
  if (!resend) {
    console.warn("[mailer] RESEND_API_KEY not set — skipping email send.");
    return { skipped: true };
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Order Confirmed — ${details.orderNumber}`,
      html: `
        <div style="font-family: sans-serif; background:#1C1815; color:#EFE8DB; padding:32px;">
          <h2 style="color:#D4A24C;">Order Confirmed</h2>
          <p>Hi ${details.name}, your order <strong>${details.orderNumber}</strong> has been received.</p>
          <p><strong>Total:</strong> Rs ${details.total.toLocaleString("en-PK")}</p>
          <p>We're firing up the grill. Thanks for ordering from Courtyard Grill!</p>
        </div>
      `,
    });
    return { skipped: false };
  } catch (err) {
    console.error("[mailer] Failed to send order email:", err);
    return { skipped: true, error: true };
  }
}
