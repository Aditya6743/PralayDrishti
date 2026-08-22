import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const toNumber = process.env.TARGET_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      return NextResponse.json({ success: false, error: "Missing Twilio config in .env.local" }, { status: 500 });
    }

    const twilioUrl = \`https://api.twilio.com/2010-04-01/Accounts/\${accountSid}/Messages.json\`;

    const body = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
      Body: message || "PralayDrishti Automated System Alert."
    });

    const authHeader = "Basic " + Buffer.from(\`\${accountSid}:\${authToken}\`).toString("base64");

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio Error:", data);
      return NextResponse.json({ success: false, error: data.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: data.sid });
  } catch (err: any) {
    console.error("SMS API Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
