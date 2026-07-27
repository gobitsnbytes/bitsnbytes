import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = (formData.get("name") ?? "").toString().trim()
    const email = (formData.get("email") ?? "").toString().trim()
    const github = (formData.get("github") ?? "").toString().trim()
    const linkedin = (formData.get("linkedin") ?? "").toString().trim()
    const idFile = formData.get("id_file") as File | null

    if (!name || !email || !github || !linkedin || !idFile) {
      return NextResponse.json(
        { error: "All fields and ID document upload are required." },
        { status: 400 },
      )
    }

    const motherboardUrl = process.env.MOTHERBOARD_API_URL || "https://motherboard.gobitsnbytes.org"
    const targetUrl = `${motherboardUrl}/api/cloud/apply`

    // Create a new FormData payload to forward
    const forwardData = new FormData()
    forwardData.append("name", name)
    forwardData.append("email", email)
    forwardData.append("github", github)
    forwardData.append("linkedin", linkedin)
    forwardData.append("id_file", idFile, idFile.name)

    const res = await fetch(targetUrl, {
      method: "POST",
      body: forwardData,
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => "")
      console.error(`Motherboard cloud apply returned ${res.status}: ${errorText}`)

      // Fallback: If Motherboard API URL is local/unreachable, attempt direct Discord Webhook dispatch
      const webhookUrl = process.env.DISCORD_CLOUD_APPROVAL_WEBHOOK_URL
      if (webhookUrl) {
        const fileArrayBuffer = await idFile.arrayBuffer()
        const discordFormData = new FormData()
        
        const payloadJson = {
          embeds: [
            {
              title: "☁️ NEW SPARKCLOUD ACCESS REQUEST",
              description: "A student builder has submitted their details & ID for SparkCloud access verification.",
              color: 16552461,
              fields: [
                { name: "👤 Full Name", value: name, inline: true },
                { name: "📧 Email", value: email, inline: true },
                { name: "🐙 GitHub Profile", value: github, inline: false },
                { name: "💼 LinkedIn Profile", value: linkedin, inline: false },
                { name: "🆔 ID Document", value: `\`${idFile.name}\` (attached)`, inline: true },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "bits&bytes™ SparkCloud Anti-Abuse System" },
            },
          ],
          components: [
            {
              type: 1,
              components: [
                { type: 2, style: 3, label: "Approve Access", custom_id: "cloud_approve", emoji: { name: "✅" } },
                { type: 2, style: 4, label: "Deny Access", custom_id: "cloud_deny", emoji: { name: "❌" } },
              ],
            },
          ],
        }

        discordFormData.append("payload_json", JSON.stringify(payloadJson))
        discordFormData.append("files[0]", new Blob([fileArrayBuffer], { type: idFile.type }), idFile.name)

        const webhookRes = await fetch(webhookUrl, {
          method: "POST",
          body: discordFormData,
        })

        if (webhookRes.ok) {
          return NextResponse.json({ success: true, message: "Application submitted via direct webhook." })
        }
      }

      return NextResponse.json(
        { error: "Failed to submit verification request. Please try again." },
        { status: res.status < 500 ? res.status : 502 },
      )
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Cloud apply route exception:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error submitting cloud verification." },
      { status: 500 },
    )
  }
}
