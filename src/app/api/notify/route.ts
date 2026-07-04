import { NextResponse } from 'next/server';

// In a real application, these would come from the database (admin settings)
// For now we will check environment variables or just mock the success if not configured
const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL;
const SMTP_SERVER = process.env.SMTP_SERVER;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log(`[API/Notify] Received notification trigger: ${type}`);

    // If MS Teams Webhook is configured, send the Adaptive Card
    if (TEAMS_WEBHOOK_URL) {
      const card = buildTeamsCard(type, data);
      
      const response = await fetch(TEAMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      });

      if (!response.ok) {
        console.error("Teams webhook failed", await response.text());
      }
    } else {
      console.log("[API/Notify] TEAMS_WEBHOOK_URL not set, skipping Teams message.");
    }

    // SMTP Logic could be added here using nodemailer if SMTP_SERVER is configured

    return NextResponse.json({ success: true, message: `Notification processed for ${type}` });
  } catch (error) {
    console.error('[API/Notify] Error processing notification:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper to build Adaptive Card for MS Teams
function buildTeamsCard(type: string, data: any) {
  let title = "มีการแจ้งเตือนใหม่จาก ITAM Borrow";
  let color = "0078D7";
  let text = "กรุณาตรวจสอบระบบ";

  if (type === 'request_submitted') {
    title = `คำขอยืมอุปกรณ์ใหม่ (รออนุมัติ)`;
    color = "F59E0B"; // Amber
    text = `ผู้ยืมส่งคำขอยืมอุปกรณ์ กรุณาตรวจสอบและอนุมัติในระบบ`;
  } else if (type === 'request_approved') {
    title = `คำขอของคุณได้รับการอนุมัติแล้ว`;
    color = "10B981"; // Emerald
    text = `คำขอยืมอุปกรณ์ได้รับการอนุมัติ กรุณาติดต่อรับของที่แผนก IT`;
  } else if (type === 'request_rejected') {
    title = `คำขอของคุณถูกปฏิเสธ`;
    color = "EF4444"; // Red
    text = `คำขอยืมอุปกรณ์ถูกปฏิเสธ กรุณาตรวจสอบเหตุผลในระบบ`;
  }

  return {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": color,
    "summary": title,
    "sections": [{
        "activityTitle": title,
        "activitySubtitle": "AssetHub ยืม-คืน",
        "activityImage": "https://cdn-icons-png.flaticon.com/512/2907/2907150.png",
        "facts": [
            { "name": "สถานะ:", "value": type },
            { "name": "รหัสคำขอ (ถ้ามี):", "value": data?.id || "-" }
        ],
        "markdown": true,
        "text": text
    }],
    "potentialAction": [{
        "@type": "OpenUri",
        "name": "เปิดหน้าระบบ",
        "targets": [{
            "os": "default",
            "uri": "https://itam-borrow.vercel.app"
        }]
    }]
  };
}
