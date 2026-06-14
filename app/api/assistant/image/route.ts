import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelChoice, aspectRatio } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const enhancedPrompt = prompt + " (High quality, clear, uncropped. If UI mockup: perfectly flat digital design, direct front-facing screen only, single device, completely filling the frame, no angled 3D floating phones, no messy borders)"

    let usedFallback = false
    const isNvidiaChoice = modelChoice === "flux.1-dev" || modelChoice === "stable-diffusion-3"
    if (isNvidiaChoice) {
      const invokeUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev"
      let width = 1024
      let height = 1024
      if (aspectRatio === "16:9") {
        width = 1024
        height = 576
      } else if (aspectRatio === "9:16") {
        width = 576
        height = 1024
      }

      const payload = {
        prompt: enhancedPrompt,
        mode: "base",
        cfg_scale: 3.5,
        width,
        height,
        seed: 0,
        steps: 50
      }
      
      try {
        const res = await fetch(invokeUrl, {
          method: "post",
          body: JSON.stringify(payload),
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${process.env.NVIDIA_KEY}`,
            "Accept": "application/json"
          }
        })
        if (!res.ok) throw new Error("Status " + res.status)
        const data = await res.json()
        const b64 = data?.image || data?.artifacts?.[0]?.base64
        if (b64) {
          return NextResponse.json({ success: true, base64: `data:image/jpeg;base64,${b64}` })
        }
        throw new Error("Missing image payload from Flux")
      } catch (fluxError) {
        console.error("NVIDIA Flux failed, falling back to Gemini:", fluxError)
        usedFallback = true
      }
    }

    // Gemini Flash Image (Hack Club) - Fallback or default choice
    const res = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HACKCLUB_PROXY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: enhancedPrompt }],
        modalities: ["image", "text"],
        image_config: { aspect_ratio: aspectRatio ?? "16:9" }
      }),
    })
    if (!res.ok) throw new Error("Status " + res.status)
    const data = await res.json()
    const imgUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url
    if (imgUrl) {
      return NextResponse.json({ success: true, base64: imgUrl, fallbackUsed: usedFallback })
    }
    throw new Error("Missing image payload from Gemini")
  } catch (err: any) {
    console.error("Image gen error in proxy:", err)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
