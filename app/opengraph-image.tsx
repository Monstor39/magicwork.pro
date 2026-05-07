import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MagicWork — индивидуальная автоматизация бизнес-процессов";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 22% 12%, rgba(139,92,246,0.20), transparent 55%), radial-gradient(circle at 92% 96%, rgba(37,99,235,0.18), transparent 50%), #FFFFFF",
          color: "#0A0A14",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6D28D9 0%, #2563EB 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 700,
              boxShadow: "0 12px 30px -12px rgba(109,40,217,0.45)",
            }}
          >
            M
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: -0.5,
              color: "#0A0A14",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                color: "#6D28D9",
                marginRight: 12,
                letterSpacing: 2,
                alignSelf: "center",
              }}
            >
              AI
            </span>
            <span>Magic</span>
            <span style={{ color: "#6D28D9" }}>Work</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 80,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1040,
              gap: 22,
            }}
          >
            <span>Автоматизируем</span>
            <span
              style={{
                background: "linear-gradient(90deg, #6D28D9 0%, #2563EB 100%)",
                backgroundClip: "text",
                color: "transparent",
                fontStyle: "italic",
              }}
            >
              бизнес-процессы
            </span>
          </div>
          <div style={{ fontSize: 28, color: "#4A4A57", maxWidth: 920 }}>
            Под вашу логику, не из коробки. AI-агенты, чат-боты, интеграции, CRM. Дубай.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 18,
            color: "#6E6E7A",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "#059669", fontSize: 22 }}>●</span>
          <span>Документооборот · администрация · −90% времени · в продакшене</span>
        </div>
      </div>
    ),
    size,
  );
}
