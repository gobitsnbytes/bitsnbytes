import { NextResponse } from "next/server";

const INDEXNOW_KEY = "d59520e5c9b74070a248eb3a69a4ce60";
const HOST = "gobitsnbytes.org";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urlList: string[] = Array.isArray(body.urlList) && body.urlList.length > 0
      ? body.urlList
      : [
          `https://${HOST}/`,
          `https://${HOST}/about`,
          `https://${HOST}/events`,
          `https://${HOST}/impact`,
          `https://${HOST}/fork`,
          `https://${HOST}/press`,
          `https://${HOST}/cloud`,
          `https://${HOST}/minecraft`,
          `https://${HOST}/join`,
          `https://${HOST}/faq`,
        ];

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok || response.status === 200 || response.status === 202,
      status: response.status,
      submittedUrls: urlList.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "IndexNow submission failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "IndexNow Submission Service",
    host: HOST,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    documentation: "POST { urlList?: string[] } to trigger IndexNow notification across search engines.",
  });
}
