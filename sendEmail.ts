import { google } from "googleapis";
import { oauth2Client } from "./googleAuth";

export async function sendAutoReply(toEmail: string) {
  if (!toEmail) {
    throw new Error("Recipient email is missing");
  }

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const subject = "Consultation Request Received";

  // ⚠️ PERHATIKAN: TIDAK BOLEH ADA SPASI DI DEPAN HEADER
  const message =
`From: "Adel Aulia" <adel@artotelgroup.com>
To: ${toEmail}
Cc: adel@artotelgroup.com
Subject: ${subject}
MIME-Version: 1.0
Content-Type: text/plain; charset="UTF-8"

Hello Mr/Mrs ${extractName(toEmail)},

Thank you for reaching out.
I've received your consultation request and will review it shortly.

I'll get back to you as soon as possible.

Best regards,
Adel Aulia`;

  const encodedMessage = Buffer
    .from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

function extractName(email: string) {
  return email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
