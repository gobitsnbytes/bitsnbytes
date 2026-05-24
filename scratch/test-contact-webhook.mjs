import dotenv from 'dotenv';
dotenv.config();

import { sendContactWebhook } from '../lib/discord.js';

async function runTest() {
  console.log("Testing Discord Webhook utility...");
  
  const success = await sendContactWebhook({
    name: "Aero (Test Bot)",
    email: "test@gobitsnbytes.org",
    subject: "Webhook Verification Test",
    message: "Hey! This is a test submission verifying that the contact form Discord webhook works perfectly. If you see this, the integration is successful!",
    source: "testing-script"
  });

  if (success) {
    console.log("✅ Webhook sent successfully!");
  } else {
    console.error("❌ Webhook failed to send.");
  }
}

runTest();
