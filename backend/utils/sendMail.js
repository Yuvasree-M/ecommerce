import nodemailer from "nodemailer";
import fs from "fs";

export const sendInvoiceMail = async (email, invoicePath) => {

  const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }

  });

  await transporter.sendMail({

    from: "Verdura Store",

    to: email,

    subject: "Your Verdura Order Invoice",

    text: "Thank you for your order. Invoice attached.",

    attachments: [
      {
        filename: "invoice.pdf",
        content: fs.createReadStream(invoicePath)
      }
    ]

  });

};