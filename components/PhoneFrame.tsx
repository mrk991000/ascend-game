"use client";

import StackGameEmbed from "./StackGameEmbed";

export default function PhoneFrame() {
  return (
    <div
      style={{
        position: "relative",
        width: "min(320px, 78vw)",
        aspectRatio: "9 / 19.5",
        borderRadius: 44,
        border: "10px solid #1c1140",
        background: "#1c1140",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.18)",
          zIndex: 2,
        }}
      />
      <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden" }}>
        <StackGameEmbed />
      </div>
    </div>
  );
}
