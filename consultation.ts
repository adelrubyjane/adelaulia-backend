import express from "express";
import { Client } from "@notionhq/client";
import { sendAutoReply } from "./sendEmail";
import { oauth2Client, SCOPES } from "./googleAuth";

const router = express.Router();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

console.log("NOTION TOKEN:", process.env.NOTION_TOKEN?.slice(0, 10));

/**
 * =========================
 * SUBMIT CONSULTATION
 * =========================
 */
router.post("/consultation", async (req, res) => {
  const { email, decision, stakes } = req.body;

  if (!email || !decision || !stakes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Save to Notion
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        Name: {
          title: [{ text: { content: email } }],
        },
      },
      children: [
        {
          object: "block",
          type: "heading_3",
          heading_3: { rich_text: [{ text: { content: "Decision" } }] },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: decision } }] },
        },
        {
          object: "block",
          type: "heading_3",
          heading_3: { rich_text: [{ text: { content: "Stakes" } }] },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: stakes } }] },
        },
      ],
    });

    // 2. Auto reply email
    await sendAutoReply(email);

    res.json({ success: true, id: response.id });
  } catch (err: any) {
    console.error("❌ ERROR:", err?.body || err);
    res.status(500).json({ error: "Internal error" });
  }
});



export default router;
