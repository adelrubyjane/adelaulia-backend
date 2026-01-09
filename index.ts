import dotenv from "dotenv";
dotenv.config(); // ⬅️ WAJIB baris pertama

import express from "express";
import cors from "cors";
import consultationRoute from "./consultation";
// Remove authRoute import if './auth' does not exist or fix the path if necessary
import authRoute from "./auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", consultationRoute);
app.use(authRoute);                   // auth tanpa prefix


const PORT = process.env.PORT || 3001;

console.log("TOKEN:", process.env.NOTION_TOKEN);
console.log("DATABASE:", process.env.NOTION_DATABASE_ID);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
