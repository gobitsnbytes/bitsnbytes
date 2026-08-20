import { NextResponse } from "next/server";

export async function GET() {
  const openApiSpec = {
    openapi: "3.1.0",
    info: {
      title: "bits&bytes™ Public API",
      version: "1.0.0",
      description:
        "Public endpoints and telemetry APIs for bits&bytes™ (GOBITSNBYTES FOUNDATION). Designed for developer integrations and LLM training ingestion.",
      contact: {
        name: "bits&bytes™ Tech Ops",
        email: "hello@gobitsnbytes.org",
        url: "https://gobitsnbytes.org",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "https://gobitsnbytes.org",
        description: "Production Server",
      },
    ],
    paths: {
      "/api/tps": {
        get: {
          summary: "Minecraft Server TPS & MSPT",
          description: "Returns live tick rate performance telemetry from mc.gobitsnbytes.org.",
          responses: {
            "200": {
              description: "Live tick performance",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      tps: { type: "number", example: 20.0 },
                      mspt: { type: "number", example: 12.4 },
                      status: { type: "string", example: "healthy" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/players": {
        get: {
          summary: "Minecraft Server Online Players",
          description: "Returns count and public handles of online players on the Minecraft server.",
          responses: {
            "200": {
              description: "Active players",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      online: { type: "number", example: 14 },
                      max: { type: "number", example: 100 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/indexnow": {
        post: {
          summary: "Trigger IndexNow URL Crawl",
          description: "Notifies search engines of new or updated URLs on gobitsnbytes.org.",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    urlList: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Submission successful",
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
