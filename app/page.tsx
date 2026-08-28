import { Download, Github, Zap, WifiOff, Trophy, Sunrise, ChevronRight } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { DOWNLOAD_URL, REPO_URL, APK_FILENAME } from "@/lib/config";

const FEATURES = [
  {
    icon: Zap,
    title: "One button",
    body: "Tap, click, or hit space. That's the whole control scheme — the challenge is all in the timing.",
  },
  {
    icon: WifiOff,
    title: "Fully offline",
    body: "No login, no ads, no network calls once it's installed. It's just a game.",
  },
  {
    icon: Trophy,
    title: "Chase your best",
    body: "Your top score is saved on your device and stares back at you every time you fall short of it.",
  },
  {
    icon: Sunrise,
    title: "The sky remembers",
    body: "Dusk to daylight — the whole scene brightens gradually as your tower climbs, so height is always visible at a glance.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Download the APK",
    body: "Hit the download button above. Your browser will save the file — Android may warn you it's from outside the Play Store, that's expected for a direct APK.",
  },
  {
    n: "02",
    title: "Allow this install",
    body: "If prompted, allow installs from your browser or file manager. It's a one-time permission, scoped to whichever app you approve.",
  },
  {
    n: "03",
    title: "Open and install",
    body: "Tap the downloaded file, confirm the install, and you're done. Ascend runs fully offline from here.",
  },
];

export default function Home() {
  return (
    <main>
      {/* header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px clamp(20px, 5vw, 56px)",
          background: "rgba(18, 10, 31, 0.75)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="display" style={{ fontSize: 22, color: "#fff8ec" }}>
          ASCEND
        </div>
        <a href={DOWNLOAD_URL} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: 12 }}>
          <Download size={16} strokeWidth={2.5} />
          Download
        </a>
      </header>

      {/* hero */}
      <section
        style={{
          background: "linear-gradient(180deg, #2c1547 0%, #1c1140 55%, #120a1f 100%)",
          padding: "clamp(40px, 8vw, 100px) clamp(20px, 5vw, 56px) clamp(60px, 8vw, 110px)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "clamp(32px, 6vw, 80px)",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div>
            <div className="eyebrow" style={{ color: "#ffc145", marginBottom: 18 }}>
              Free · Android · No ads
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(48px, 7vw, 88px)", color: "#fff8ec", marginBottom: 20 }}
            >
              Stack blocks.
              <br />
              Chase the sunrise.
            </h1>
            <p
              className="mono"
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(255,248,236,0.75)",
                maxWidth: 480,
                marginBottom: 34,
              }}
            >
              Ascend is a one-button stacking game — line up each block perfectly to
              keep climbing, or watch it shear off if you miss. The sky brightens
              from dusk to daylight the higher you get. Free APK, sideload it
              straight from GitHub.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href={DOWNLOAD_URL} className="btn btn-primary">
                <Download size={18} strokeWidth={2.5} />
                Download APK
              </a>
              <a href={REPO_URL} className="btn btn-ghost" target="_blank" rel="noreferrer">
                <Github size={18} strokeWidth={2.2} />
                View on GitHub
              </a>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "rgba(255,248,236,0.4)", marginTop: 16 }}>
              {APK_FILENAME} · sideloaded install, not on the Play Store
            </div>
          </div>

          <PhoneFrame />
        </div>
      </section>

      {/* features */}
      <section style={{ padding: "clamp(60px, 8vw, 110px) clamp(20px, 5vw, 56px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="eyebrow" style={{ color: "#2ec4b6", marginBottom: 14 }}>
            Why it's worth the sideload
          </div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 4vw, 44px)", marginBottom: 44 }}>
            Small game, no nonsense.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 20,
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="card">
                <f.icon size={26} strokeWidth={2} color="#ffc145" style={{ marginBottom: 16 }} />
                <div className="display" style={{ fontSize: 20, marginBottom: 10, color: "#fff8ec" }}>
                  {f.title}
                </div>
                <p className="mono" style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,248,236,0.65)" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* install steps */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 110px) clamp(20px, 5vw, 56px)",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="eyebrow" style={{ color: "#ff6f59", marginBottom: 14 }}>
            Installing
          </div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 4vw, 44px)", marginBottom: 44 }}>
            Three steps, no store needed.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 20 }}>
                <div
                  className="display"
                  style={{ fontSize: 32, color: "rgba(255,248,236,0.25)", minWidth: 52 }}
                >
                  {s.n}
                </div>
                <div>
                  <div className="display" style={{ fontSize: 19, marginBottom: 6, color: "#fff8ec" }}>
                    {s.title}
                  </div>
                  <p className="mono" style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,248,236,0.65)" }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <a
            href={DOWNLOAD_URL}
            className="btn btn-primary"
            style={{ marginTop: 40 }}
          >
            <Download size={18} strokeWidth={2.5} />
            Download APK
            <ChevronRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* footer */}
      <footer
        style={{
          padding: "36px clamp(20px, 5vw, 56px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="mono" style={{ fontSize: 12, color: "rgba(255,248,236,0.4)" }}>
          Ascend — built with Next.js, deployed on Vercel.
        </div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="mono"
          style={{ fontSize: 12, color: "rgba(255,248,236,0.5)", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Github size={14} />
          Source on GitHub
        </a>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
