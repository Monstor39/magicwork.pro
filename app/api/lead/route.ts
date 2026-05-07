import { NextResponse } from "next/server";
import { Resend } from "resend";

type LeadPayload = {
  name?: string;
  business?: string;
  pain?: string;
  contact?: string;
  time?: string;
  locale?: string;
};

const FROM_EMAIL = process.env.LEAD_FROM_EMAIL ?? "MagicWork <leads@magicwork.pro>";
const TO_EMAIL = process.env.LEAD_EMAIL ?? "golodbizai@gmail.com";

export async function POST(req: Request) {
  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const contact = (data.contact ?? "").trim();
  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const lines = [
    `Name: ${name}`,
    data.business ? `Company / project: ${data.business}` : null,
    data.pain ? `Need: ${data.pain}` : null,
    `Contact: ${contact}`,
    data.time ? `Best time: ${data.time}` : null,
    data.locale ? `Locale: ${data.locale}` : null,
  ].filter(Boolean) as string[];
  const summary = lines.join("\n");

  const resendKey = process.env.RESEND_API_KEY;
  const tgToken = process.env.TG_BOT_TOKEN;
  const tgChat = process.env.TG_CHAT_ID;

  const tasks: Promise<unknown>[] = [];

  if (resendKey) {
    const resend = new Resend(resendKey);
    tasks.push(
      resend.emails
        .send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          subject: `Новая заявка: ${name}${data.business ? ` (${data.business})` : ""}`,
          text: summary,
        })
        .catch((e) => console.error("[lead] resend failed:", e)),
    );
  }

  if (tgToken && tgChat) {
    const md = [
      `*Новая заявка*`,
      `*Имя:* ${escapeMd(name)}`,
      data.business ? `*Компания:* ${escapeMd(data.business)}` : null,
      data.pain ? `*Запрос:* _${escapeMd(data.pain)}_` : null,
      `*Контакт:* \`${escapeMd(contact)}\``,
      data.time ? `*Удобное время:* ${escapeMd(data.time)}` : null,
      data.locale ? `*Локаль:* ${data.locale}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    tasks.push(
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChat,
          text: md,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }).catch((e) => console.error("[lead] telegram failed:", e)),
    );
  }

  if (tasks.length === 0) {
    console.log("[lead] (no transports configured)\n" + summary);
  } else {
    await Promise.allSettled(tasks);
  }

  return NextResponse.json({ ok: true });
}

function escapeMd(s: string) {
  return s.replace(/([_*`\[\]])/g, "\\$1");
}
