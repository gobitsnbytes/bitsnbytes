import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio")

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 })
    }

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error("Assistant voice API error:", error)
    return NextResponse.json(
      { error: "Failed to transcribe audio." },
      { status: 500 }
    )
  }
}


