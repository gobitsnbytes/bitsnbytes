import dotenv from 'dotenv';
dotenv.config();

import { sendContactWebhook } from '../lib/discord';

async function runTest() {
  console.log("Testing Discord Webhook utility via tsx...");
  
  const success = await sendContactWebhook({
    name: "Akshat Kushwaha (CTO Test)",
    email: "akshat@gobitsnbytes.org",
    subject: "Webhook Verification Test",
    message: "Hey! This is a test submission verifying that the contact form Discord webhook works perfectly. If you see this, the integration is successful!",
    source: "verification-test"
  });

  if (success) {
    console.log("✅ Webhook sent successfully!");
  } else {
    console.error("❌ Webhook failed to send.");
  }
}

runTest();
