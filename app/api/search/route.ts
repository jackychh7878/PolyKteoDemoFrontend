import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const confidenceLevel = searchParams.get("confidence_level") || "0.4";

  if (!query) {
    return NextResponse.json({ error: "No query provided" });
  }

  try {
    // Forward the request to the PolyKteo API
    const response = await fetch(
      `https://poly-kteo-demo-e2ach4ewcuayb3b6.eastasia-01.azurewebsites.net/search?query=${encodeURIComponent(query)}&confidence_level=${confidenceLevel}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from PolyKteo API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from PolyKteo API" },
      { status: 500 }
    );
  }
}
