import * as Brevo from "@getbrevo/brevo";
import fs from "fs";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

export const sendInvoiceMail = async (email, invoicePath, order) => {
  try {
    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">Rs. ${item.price}</td>
        </tr>
      `
      )
      .join("");

    const htmlTemplate = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,0.1);">
        
        <div style="background:#16a34a;color:white;padding:20px;text-align:center;">
          <h2 style="margin:0;">Verdura Organic Store</h2>
          <p style="margin:5px 0 0;">Your Order Invoice</p>
        </div>

        <div style="padding:25px;">
          <p>Hello,</p>
          <p>Thank you for shopping with <strong>Verdura</strong>. Your order has been successfully placed.</p>

          <h3 style="margin-top:25px;">Order Details</h3>

          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:10px;text-align:left;">Product</th>
                <th style="padding:10px;text-align:center;">Qty</th>
                <th style="padding:10px;text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div style="margin-top:20px;text-align:right;">
            <h3>Total: Rs. ${order.totalAmount}</h3>
          </div>

          <p style="margin-top:30px;">Your invoice PDF is attached with this email.</p>

          <p style="margin-top:30px;">
            Regards,<br>
            <strong>Verdura Organic Store</strong>
          </p>
        </div>

        <div style="background:#f1f5f9;padding:15px;text-align:center;font-size:12px;color:#555;">
          &copy; ${new Date().getFullYear()} Verdura Organic Store. All rights reserved.
        </div>

      </div>
    </div>
    `;

    // Read PDF and convert to base64 for attachment
    const pdfBuffer = fs.readFileSync(invoicePath);
    const pdfBase64 = pdfBuffer.toString("base64");

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Your Verdura Order Invoice";
    sendSmtpEmail.htmlContent = htmlTemplate;
    sendSmtpEmail.sender = {
      name: "Verdura Organic Store",
      email: process.env.ADMIN_EMAIL,
    };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.attachment = [
      {
        content: pdfBase64,
        name: "invoice.pdf",
      },
    ];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Invoice email sent to:", email);

    if (fs.existsSync(invoicePath)) {
      fs.unlinkSync(invoicePath);
    }
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};