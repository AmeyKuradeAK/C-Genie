import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    // Load credentials from environment variables
    const clientId = process.env.JD_CLIENT_ID;
    const clientSecret = process.env.JD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Server error: Missing API credentials" }, { status: 500 });
    }

    // API request payload
    const payload = {
      script: code,
      language: "c",
      versionIndex: "5", // C (GCC 9.1.0)
      clientId,
      clientSecret,
    };

    // Send request to JDoodle API
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Check if response is OK
    if (!response.ok) {
      return NextResponse.json({ error: `JDoodle API error: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    console.error("Compilation error:", error);
    return NextResponse.json({ error: "Failed to compile code" }, { status: 500 });
  }
}