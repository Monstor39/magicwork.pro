import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MagicWork — автоматизация бизнес-процессов";

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
            "radial-gradient(circle at 20% 0%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 90% 100%, rgba(96,165,250,0.25), transparent 50%), #08080F",
          color: "#EDEDF2",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #8B5CF6 0%, #60A5FA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            Magic<span style={{ color: "#A78BFA" }}>Work</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            Автоматизируем{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #A78BFA 0%, #60A5FA 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              бизнес-процессы
            </span>
          </div>
          <div style={{ fontSize: 26, color: "#9999A8", maxWidth: 900 }}>
            AI-агенты, чат-боты, интеграции, CRM, кастомная разработка. Дубай.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            color: "#62626F",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "#34D399" }}>●</span>
          <span>Документооборот · администрация · −90% времени · в продакшене</span>
        </div>
      </div>
    ),
    size,
  );
}
