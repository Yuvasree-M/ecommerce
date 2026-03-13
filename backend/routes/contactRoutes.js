import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Email to Admin
    await resend.emails.send({
      from: "Verdura Contact <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Contact Request from ${name} - Verdura`,
      html: `
      <div style="font-family: Arial; background:#f4f6f5; padding:40px">
        <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08)">
          
          <div style="background:#166534;color:white;padding:20px;text-align:center">
            <h2 style="margin:0">Verdura</h2>
            <p style="margin:5px 0 0">New Contact Request</p>
          </div>

          <div style="padding:30px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px;font-weight:bold">Name</td>
                <td style="padding:10px">${name}</td>
              </tr>
              <tr style="background:#f9fafb">
                <td style="padding:10px;font-weight:bold">Email</td>
                <td style="padding:10px">${email}</td>
              </tr>
              <tr>
                <td style="padding:10px;font-weight:bold">Message</td>
                <td style="padding:10px">${message}</td>
              </tr>
            </table>
          </div>

          <div style="background:#f9fafb;padding:15px;text-align:center;font-size:13px;color:#6b7280">
            Message sent from Verdura Contact Form
          </div>

        </div>
      </div>
      `,
    });

    // Auto Reply to User
    await resend.emails.send({
      from: "Verdura Support <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting Verdura",
      html: `
      <div style="font-family: Arial; background:#f4f6f5; padding:40px">
        <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08)">
          
          <div style="background:#166534;color:white;padding:20px;text-align:center">
            <h2 style="margin:0">Verdura</h2>
          </div>

          <div style="padding:30px">
            <h3 style="color:#166534">Hello ${name},</h3>
            <p>
              Thank you for contacting <b>Verdura</b>.
              We have received your message and our team will respond shortly.
            </p>
            <p style="margin-top:20px">
              If your request is urgent, feel free to reply to this email.
            </p>
            <br>
            <p>
              Best regards,<br>
              <b>Verdura Support Team</b>
            </p>
          </div>

          <div style="background:#f9fafb;padding:15px;text-align:center;font-size:13px;color:#6b7280">
            &copy; ${new Date().getFullYear()} Verdura. All rights reserved.
          </div>

        </div>
      </div>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Contact mail error:", err.message);
    res.status(500).json({ error: "Failed to send email", detail: err.message });
  }
});

export default router;