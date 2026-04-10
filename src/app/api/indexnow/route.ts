import { NextResponse } from "next/server";

const INDEXNOW_KEY = "a8f9c1b2d4e64f789012345678abcdef";
const HOST = "jadehospitainment.com";

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "urls array is required in the request body" },
        { status: 400 },
      );
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    // Ping Bing
    const bingResponse = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Ping Yandex (which handles Seznam and IndexNow default too)
    const yandexResponse = await fetch("https://yandex.com/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      bingStatus: bingResponse.status,
      yandexStatus: yandexResponse.status,
      message: "Successfully pinged IndexNow endpoints",
    });
  } catch (error) {
    console.error("IndexNow ping failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error while pinging IndexNow" },
      { status: 500 },
    );
  }
}
