import { NextRequest, NextResponse } from "next/server"

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

export async function POST(req: NextRequest) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    return NextResponse.json(
      { error: "WEB3FORMS_ACCESS_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const body = await req.json()
    const name = (body?.name ?? "").toString().trim()
    const email = (body?.email ?? "").toString().trim()
    const school = (body?.school ?? "").toString().trim()
    const experience = (body?.experience ?? "").toString().trim()
    const interests = (Array.isArray(body?.interests) ? body.interests : []).join(", ")
    const message = (body?.message ?? "").toString().trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      )
    }

    const formattedMessage = `
New join request from Bits&Bytes site.

Name: ${name}
Email: ${email}
School: ${school || "Not provided"}
Experience: ${experience || "Not provided"}
Interests: ${interests || "Not provided"}

Message:
${message}
`.trim()

    const payload = {
      access_key: accessKey,
      name,
      email,
      subject: "New join request from Bits&Bytes",
      message: formattedMessage,
    }

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!result?.success) {
      console.error("Web3Forms join error:", result)
      return NextResponse.json(
        { error: "Failed to submit join form." },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Join API error:", error)
    return NextResponse.json(
      { error: "Something went wrong while submitting the join form." },
      { status: 500 },
    )
  }
}


