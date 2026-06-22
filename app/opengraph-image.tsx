import { ImageResponse } from "next/og";

// Tamaño estándar para Open Graph
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#080d0b",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid de fondo sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(45,122,71,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45,122,71,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Degradado radial de acento */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,122,71,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo CM */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            border: "1.5px solid rgba(45,122,71,0.5)",
            background: "rgba(45,122,71,0.12)",
            borderRadius: 6,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              fontWeight: 700,
              color: "#5cb87e",
              letterSpacing: "0.05em",
            }}
          >
            CM
          </span>
        </div>

        {/* Etiqueta superior */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 500,
            color: "#7a9486",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Base de datos · Fuentes abiertas
        </span>

        {/* Título principal */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#e8f0ec",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            marginBottom: 20,
          }}
        >
          Centinela México
        </h1>

        {/* Descripción */}
        <p
          style={{
            fontSize: 24,
            color: "#7a9486",
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          Fuerzas armadas, estados, equipamiento y operativos de seguridad.
          Información oficial, verificable y de acceso público.
        </p>

        {/* Barra inferior de acento */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #2d7a47 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
