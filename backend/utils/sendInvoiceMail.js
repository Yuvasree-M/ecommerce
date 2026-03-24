import { createRequire } from "module";
const require = createRequire(import.meta.url);
const SibApiV3Sdk = require("sib-api-v3-sdk");

import fs from "fs";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Sends an order confirmation email with the invoice attached

export const sendInvoiceMail = async (email, invoicePath, order) => {
  try {

    const name    = order.name    || order.shippingInfo?.name    || "Valued Customer";
    const items   = order.items   || [];
    const total   = order.totalAmount ?? items.reduce((s, i) => s + i.price * i.quantity, 0);

    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });

    const itemsHTML = items.map((item) => `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:middle;">
          <div style="display:flex;align-items:center;gap:12px;">
            <img
              src="${item.image || ''}"
              alt="${item.name}"
              width="44"
              height="44"
              style="border-radius:8px;object-fit:cover;border:1px solid #e2e8f0;flex-shrink:0;"
            />
            <span style="font-weight:600;color:#1e293b;font-size:14px;">${item.name}</span>
          </div>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;text-align:center;color:#64748b;font-size:14px;">
          <span style="background:#f0fdf4;color:#16a34a;font-weight:700;padding:3px 10px;border-radius:100px;border:1px solid #bbf7d0;font-size:12px;">
            ${item.quantity}
          </span>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;text-align:right;color:#64748b;font-size:14px;">
          Rs. ${item.price}
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;color:#1e293b;font-size:14px;">
          Rs. ${item.price * item.quantity}
        </td>
      </tr>
    `).join("");

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Verdura Invoice</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- ══ HEADER ══ -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);border-radius:16px 16px 0 0;padding:32px 36px;text-align:center;">
              <div style="display:inline-block;">
                <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                  🌿 Verdura
                </h1>
                <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:0.12em;text-transform:uppercase;">
                  Organic Grocery Store
                </p>
              </div>
              <div style="margin-top:20px;background:rgba(255,255,255,0.12);border-radius:10px;padding:12px 20px;display:inline-block;">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);font-weight:600;">
                  ✅ Order Confirmed · ${dateStr}
                </p>
              </div>
            </td>
          </tr>

          <!-- ══ BODY ══ -->
          <tr>
            <td style="background:#ffffff;padding:32px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
                Hi ${name}! 👋
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
                Thank you for shopping with <strong style="color:#16a34a;">Verdura</strong>.
                Your order has been placed successfully. Here's a summary below, and your
                invoice PDF is attached for your records.
              </p>

              <!-- Order items table -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Item</th>
                    <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
                    <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Price</th>
                    <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td></td>
                  <td width="220" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#64748b;padding-bottom:8px;">Delivery</td>
                        <td style="text-align:right;font-size:13px;font-weight:700;color:#16a34a;padding-bottom:8px;">Free</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top:1px solid #bbf7d0;padding-top:8px;"></td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:700;color:#1e293b;padding-top:4px;">Grand Total</td>
                        <td style="text-align:right;font-size:20px;font-weight:800;color:#16a34a;padding-top:4px;">Rs. ${total}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

             

            </td>
          </tr>

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#16a34a;">
                🌿 Verdura Organic Store
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
                Need help? Contact us at
                <a href="mailto:support@verdura.com" style="color:#16a34a;text-decoration:none;font-weight:600;">support@verdura.com</a>
                <br/>
                © ${new Date().getFullYear()} Verdura Organic Store. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    const pdfBuffer = fs.readFileSync(invoicePath);
    const pdfBase64 = pdfBuffer.toString("base64");

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject    = `🌿 Your Verdura Invoice — ${dateStr}`;
    sendSmtpEmail.htmlContent = htmlTemplate;
    sendSmtpEmail.sender     = { name: "Verdura Organic Store", email: process.env.ADMIN_EMAIL };
    sendSmtpEmail.to         = [{ email, name }];
    sendSmtpEmail.attachment = [{ content: pdfBase64, name: `verdura-invoice-${Date.now()}.pdf` }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Invoice email sent to:", email);

    if (fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);

  } catch (error) {
    console.error(" Email sending failed:", error.message);
  }
};