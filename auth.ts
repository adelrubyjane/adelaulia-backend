import express from "express";
import { oauth2Client, SCOPES } from "./googleAuth";

const router = express.Router();

// LOGIN GOOGLE
router.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(url);
});

// CALLBACK
router.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code as string);
  oauth2Client.setCredentials(tokens);

  console.log("✅ REFRESH TOKEN:", tokens.refresh_token);

  res.send("Google Auth Success! You can close this tab.");
});

export default router;
