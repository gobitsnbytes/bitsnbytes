/**
 * Discord Webhook Notifier Utility
 * Sends contact form submissions to the configured Discord channel.
 */

export interface ContactWebhookParams {
  name: string
  email: string
  subject?: string
  message: string
  source: string
}

export async function sendContactWebhook(params: ContactWebhookParams): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_CONTACT_WEBHOOK_URL
  if (!webhookUrl) {
    console.error("DISCORD_CONTACT_WEBHOOK_URL is not configured.")
    return false
  }

  const { name, email, subject, message, source } = params

  // Format fields for embed, ensuring empty fields are handled gracefully
  const payload = {
    embeds: [
      {
        title: "📩 New Contact Form Submission",
        description: `A visitor sent a message via the **${source}**.`,
        color: 0x97192C, // Burgundy brand color
        fields: [
          {
            name: "👤 Name",
            value: name || "Not provided",
            inline: true,
          },
          {
            name: "✉️ Email",
            value: email || "Not provided",
            inline: true,
          },
          {
            name: "📝 Subject",
            value: subject || "No Subject",
            inline: false,
          },
          {
            name: "💬 Message",
            value: message || "No Message",
            inline: false,
          },
          {
            name: "🔗 Source",
            value: source ? `\`${source}\`` : "`website`",
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "bits&bytes™ Notification System",
        },
      },
    ],
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`Discord webhook failed with status ${res.status}: ${text}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending message to Discord webhook:", error)
    return false
  }
}
