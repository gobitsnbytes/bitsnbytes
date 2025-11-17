import { NextRequest, NextResponse } from "next/server"

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

export async function POST(req: NextRequest) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    return NextResponse.json(
      { error: "WEB3FORMS_ACCESS_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const name = (body?.name ?? "").toString().trim()
    const email = (body?.email ?? "").toString().trim()
    const subject = (body?.subject ?? "").toString().trim()
    const message = (body?.message ?? "").toString().trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    const payload = {
      access_key: accessKey,
      name,
      email,
      subject: subject || "New contact from Bits&Bytes site",
      message,
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
      console.error("Web3Forms error:", result)
      return NextResponse.json(
        { error: "Failed to submit contact form." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Something went wrong while submitting the form." },
      { status: 500 }
    )
  }
}


