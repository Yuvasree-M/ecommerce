import { createRequire } from "module";
const require = createRequire(import.meta.url);
const SibApiV3Sdk = require("sib-api-v3-sdk");
import fs from "fs";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendInvoiceMail = async (email, invoicePath, order) => {
  try {
    const name    = order.name || "Valued Customer";
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
        style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);
            padding:32px 36px;text-align:center;">
            <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;">🌿 Verdura</h1>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);
              text-transform:uppercase;letter-spacing:0.1em;">Organic Grocery Store</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px;">
            <p style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1e293b;">
              Hi ${name}! 👋
            </p>
            <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.7;">
              Thank you for shopping with <strong style="color:#16a34a;">Verdura</strong>.
              Your order has been placed successfully on <strong>${dateStr}</strong>.
            </p>

            <!-- Highlight box -->
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;
              padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#15803d;font-weight:600;">
                📄 Your invoice is attached to this email as a PDF.
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#64748b;">
                Open the attachment to view your full order details, itemised bill, and payment summary.
              </p>
            </div>

            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
              If you have any questions about your order, reply to this email or reach us at
              <a href="mailto:support@verdura.com"
                style="color:#16a34a;text-decoration:none;font-weight:600;">
                support@verdura.com
              </a>
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;
            padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
              © ${new Date().getFullYear()} Verdura Organic Store · Tamil Nadu, India<br/>
              This is a system-generated email. Please do not reply directly.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const pdfBase64 = fs.readFileSync(invoicePath).toString("base64");

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject     = `🌿 Your Verdura Invoice — ${dateStr}`;
    sendSmtpEmail.htmlContent = htmlTemplate;
    sendSmtpEmail.sender      = { name: "Verdura Organic Store", email: process.env.ADMIN_EMAIL };
    sendSmtpEmail.to          = [{ email, name }];
    sendSmtpEmail.attachment  = [{ content: pdfBase64, name: `verdura-invoice-${Date.now()}.pdf` }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Invoice email sent to:", email);

    if (fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);

  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};