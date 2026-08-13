import { readFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_PATH = path.join(
  process.cwd(),
  "output",
  "pdf",
  "bitsnbytes-partnership-prospectus-2026.pdf",
);

export async function GET(request: NextRequest) {
  const pdf = await readFile(PDF_PATH);
  const isDownload = request.nextUrl.searchParams.get("download") === "1";
  const filename = "bitsnbytes-partnership-prospectus-2026.pdf";

  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-length": String(pdf.length),
      "content-disposition": `${isDownload ? "attachment" : "inline"}; filename="${filename}"`,
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
