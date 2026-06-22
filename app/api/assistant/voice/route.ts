import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"

const openai = new OpenAI({
  apiKey: process.env.HACKCLUB_PROXY_API_KEY || "placeholder-key",
  baseURL: "https://ai.hackclub.com/proxy/v1",
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio")

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 })
    }

    try {
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
      })

      return NextResponse.json({ text: transcription.text })
    } catch (err) {
      const apiError = err as APIError
      const code = (apiError as any)?.code ?? (apiError as any)?.error?.code
      const status = (apiError as any)?.status

      // Project doesn't have access to whisper-1 – gracefully degrade.
      if (code === "model_not_found" || status === 403) {
        console.warn("Whisper model not available for this project; disabling voice transcription.")
        return NextResponse.json(
          {
            error:
              "Voice transcription model is not enabled for this project. You can still use text chat normally.",
          },
          { status: 200 }
        )
      }

      throw err
    }
  } catch (error) {
    console.error("Assistant voice API error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio." }, { status: 500 })
  }
}


