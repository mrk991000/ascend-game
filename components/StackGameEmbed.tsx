"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---------- constants ----------
const BLOCK_H = 32;
const BASE_WIDTH = 170;
const PERFECT_PX = 6;
const GRAVITY = 0.65;
const KEEP_ROWS = 8;
const BLOCK_COLORS = ["#ff6f59", "#ffc145", "#2ec4b6"];

const SKY_STOPS: { h: number; top: string; bottom: string }[] = [
  { h: 0, top: "#241734", bottom: "#120a1f" },
  { h: 10, top: "#3b2464", bottom: "#1c1140" },
  { h: 24, top: "#7a3b6d", bottom: "#3a1f52" },
  { h: 42, top: "#ff8b6b", bottom: "#5b2a55" },
  { h: 64, top: "#ffd97a", bottom: "#ff9a5a" },
  { h: 90, top: "#8fd8ff", bottom: "#ffe1a8" },
];

// ---------- helpers ----------
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpColor(c1: string, c2: string, t: number) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}
function skyColors(climb: number) {
  let i = 0;
  while (i < SKY_STOPS.length - 2 && climb > SKY_STOPS[i + 1].h) i++;
  const s0 = SKY_STOPS[i];
  const s1 = SKY_STOPS[i + 1];
  const t = Math.min(1, Math.max(0, (climb - s0.h) / (s1.h - s0.h || 1)));
  return { top: lerpColor(s0.top, s1.top, t), bottom: lerpColor(s0.bottom, s1.bottom, t) };
}
// ---------- types ----------
interface StackBlock {
  x: number;
  width: number;
  color: string;
}
interface Debris {
  x: number;
  y: number;
  width: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  alpha: number;
}
interface Popup {
  x: number;
  y: number;
  text: string;
  alpha: number;
}
type Phase = "ready" | "playing" | "over";

export default function StackGameEmbed() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const stackRef = useRef<StackBlock[]>([]);
  const movingRef = useRef<{ x: number; width: number; dir: number; speed: number } | null>(null);
  const debrisRef = useRef<Debris[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const cameraRef = useRef(0);
  const climbRef = useRef(0);
  const shakeRef = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  const overAtRef = useRef(0);
  const comboRef = useRef(0);
  const fallingBlockRef = useRef<
    (StackBlock & { y: number; vx: number; vy: number; rot: number; vr: number }) | null
  >(null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem("ascend_best") || 0);
    if (stored) setBest(stored);
  }, []);

  const resetGame = useCallback((width: number) => {
    stackRef.current = [{ x: width / 2 - BASE_WIDTH / 2, width: BASE_WIDTH, color: "#fff8ec" }];
    movingRef.current = { x: 0, width: BASE_WIDTH, dir: 1, speed: 2.6 };
    debrisRef.current = [];
    popupsRef.current = [];
    fallingBlockRef.current = null;
    cameraRef.current = 0;
    climbRef.current = 0;
    comboRef.current = 0;
    setCombo(0);
    setScore(0);
  }, []);

  const startGame = useCallback(
    (width: number) => {
      resetGame(width);
      phaseRef.current = "playing";
      setPhase("playing");
    },
    [resetGame]
  );

  const drop = useCallback(() => {
    if (phaseRef.current !== "playing" || !movingRef.current) return;
    const stack = stackRef.current;
    const top = stack[stack.length - 1];
    const moving = movingRef.current;

    const overlapLeft = Math.max(moving.x, top.x);
    const overlapRight = Math.min(moving.x + moving.width, top.x + top.width);
    const overlapWidth = overlapRight - overlapLeft;

    const rowIndex = stack.length;
    const canvas = canvasRef.current;
    const height = canvas ? canvas.clientHeight : 800;
    const floorY = height * 0.82;
    const screenY = floorY - rowIndex * BLOCK_H + cameraRef.current;

    if (overlapWidth <= 2) {
      // miss — send it tumbling
      fallingBlockRef.current = {
        x: moving.x,
        width: moving.width,
        color: BLOCK_COLORS[rowIndex % BLOCK_COLORS.length],
        y: screenY,
        vx: moving.dir * 2,
        vy: -4,
        rot: 0,
        vr: moving.dir * 0.12,
      };
      shakeRef.current = 10;
      movingRef.current = null;
      phaseRef.current = "over";
      overAtRef.current = performance.now();
      setPhase("over");
      const finalScore = stack.length - 1;
      setScore(finalScore);
      setBest((prev) => {
        const next = Math.max(prev, finalScore);
        window.localStorage.setItem("ascend_best", String(next));
        return next;
      });
      return;
    }

    const offset = moving.x - top.x;
    const perfect = Math.abs(offset) < PERFECT_PX;
    const newWidth = perfect ? moving.width : overlapWidth;
    const newX = perfect ? top.x : overlapLeft;

    if (!perfect) {
      const overhangLeft = moving.x < top.x;
      const chipWidth = moving.width - overlapWidth;
      const chipX = overhangLeft ? moving.x : overlapRight;
      debrisRef.current.push({
        x: chipX,
        y: screenY,
        width: chipWidth,
        color: BLOCK_COLORS[rowIndex % BLOCK_COLORS.length],
        vx: overhangLeft ? -1.6 : 1.6,
        vy: -2,
        rot: 0,
        vr: overhangLeft ? -0.15 : 0.15,
        alpha: 1,
      });
      comboRef.current = 0;
    } else {
      comboRef.current += 1;
      popupsRef.current.push({
        x: newX + newWidth / 2,
        y: screenY,
        text: comboRef.current > 1 ? `PERFECT x${comboRef.current}` : "PERFECT",
        alpha: 1,
      });
      shakeRef.current = 4;
    }
    setCombo(comboRef.current);

    const newBlock: StackBlock = {
      x: newX,
      width: newWidth,
      color: BLOCK_COLORS[rowIndex % BLOCK_COLORS.length],
    };
    stack.push(newBlock);
    setScore(stack.length - 1);

    const canvasWidth = canvas ? canvas.clientWidth : 400;
    const nextDir = moving.dir > 0 ? -1 : 1;
    const nextSpeed = Math.min(6.5, 2.6 + (stack.length - 1) * 0.06);
    movingRef.current = {
      x: nextDir > 0 ? 0 : canvasWidth - newWidth,
      width: newWidth,
      dir: nextDir,
      speed: nextSpeed,
    };
  }, []);

  const handleAction = useCallback(() => {
    if (phaseRef.current === "ready") {
      const canvas = canvasRef.current;
      startGame(canvas ? canvas.clientWidth : 400);
    } else if (phaseRef.current === "playing") {
      drop();
    } else if (phaseRef.current === "over") {
      if (performance.now() - overAtRef.current > 350) {
        const canvas = canvasRef.current;
        startGame(canvas ? canvas.clientWidth : 400);
      }
    }
  }, [drop, startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const c = canvasRef.current;
      const w = wrapRef.current;
      if (!c || !w) return;
      width = w.clientWidth;
      height = w.clientHeight;
      c.width = width * dpr;
      c.height = height * dpr;
      c.style.width = `${width}px`;
      c.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (stackRef.current.length === 0) {
        resetGame(width);
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        handleAction();
      }
    }
    window.addEventListener("keydown", onKey);

    function onPointerDown() {
      handleAction();
    }
    canvas.addEventListener("pointerdown", onPointerDown);

    let raf = 0;

    function step() {
      const w = width;
      const h = height;
      const floorY = h * 0.82;

      // moving block update
      if (phaseRef.current === "playing" && movingRef.current) {
        const m = movingRef.current;
        m.x += m.dir * m.speed;
        if (m.x <= 0) {
          m.x = 0;
          m.dir = 1;
        } else if (m.x + m.width >= w) {
          m.x = w - m.width;
          m.dir = -1;
        }
      }

      // camera
      const targetCam = Math.max(0, (stackRef.current.length - KEEP_ROWS) * BLOCK_H);
      cameraRef.current = lerp(cameraRef.current, targetCam, 0.1);
      climbRef.current = lerp(climbRef.current, stackRef.current.length - 1, 0.08);
      shakeRef.current *= 0.85;

      // debris physics
      debrisRef.current.forEach((d) => {
        d.vy += GRAVITY;
        d.x += d.vx;
        d.y += d.vy;
        d.rot += d.vr;
        if (d.y > h + 60) d.alpha -= 0.05;
      });
      debrisRef.current = debrisRef.current.filter((d) => d.alpha > 0.02);

      // falling block (on miss)
      const fb = fallingBlockRef.current;
      if (fb) {
        fb.vy += GRAVITY;
        fb.x += fb.vx;
        fb.y += fb.vy;
        fb.rot += fb.vr;
        if (fb.y > h + 100) fallingBlockRef.current = null;
      }

      // popups
      popupsRef.current.forEach((p) => {
        p.y -= 0.6;
        p.alpha *= 0.94;
      });
      popupsRef.current = popupsRef.current.filter((p) => p.alpha > 0.02);

      // ---- render ----
      const sky = skyColors(climbRef.current);
      const grad = ctx!.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, sky.top);
      grad.addColorStop(1, sky.bottom);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      const shakeX = (Math.random() - 0.5) * shakeRef.current;
      const shakeY = (Math.random() - 0.5) * shakeRef.current;
      ctx!.save();
      ctx!.translate(shakeX, shakeY);

      function drawBlock(x: number, y: number, bw: number, color: string) {
        const r = 4;
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.roundRect(x, y, bw, BLOCK_H - 3, r);
        ctx!.fill();
        ctx!.fillStyle = "rgba(255,255,255,0.22)";
        ctx!.fillRect(x, y, bw, 4);
      }

      stackRef.current.forEach((b, i) => {
        const y = floorY - i * BLOCK_H + cameraRef.current;
        if (y > -BLOCK_H && y < h + BLOCK_H) drawBlock(b.x, y, b.width, b.color);
      });

      if (phaseRef.current === "playing" && movingRef.current) {
        const m = movingRef.current;
        const y = floorY - stackRef.current.length * BLOCK_H + cameraRef.current;
        drawBlock(m.x, y, m.width, BLOCK_COLORS[stackRef.current.length % BLOCK_COLORS.length]);
      }

      debrisRef.current.forEach((d) => {
        ctx!.save();
        ctx!.globalAlpha = d.alpha;
        ctx!.translate(d.x + d.width / 2, d.y + BLOCK_H / 2);
        ctx!.rotate(d.rot);
        ctx!.fillStyle = d.color;
        ctx!.fillRect(-d.width / 2, -BLOCK_H / 2, d.width, BLOCK_H - 3);
        ctx!.restore();
      });

      if (fb) {
        ctx!.save();
        ctx!.translate(fb.x + fb.width / 2, fb.y + BLOCK_H / 2);
        ctx!.rotate(fb.rot);
        ctx!.fillStyle = fb.color;
        ctx!.fillRect(-fb.width / 2, -BLOCK_H / 2, fb.width, BLOCK_H - 3);
        ctx!.restore();
      }

      ctx!.restore();

      // popups (perfect text) — screen space, not shaken
      popupsRef.current.forEach((p) => {
        ctx!.globalAlpha = p.alpha;
        ctx!.fillStyle = "#fff8ec";
        ctx!.font = "700 15px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText(p.text, p.x, p.y);
      });
      ctx!.globalAlpha = 1;

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAction, resetGame]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ borderRadius: "inherit" }} />

      {/* top score bar, visible while playing or after */}
      {phase !== "ready" && (
        <div
          style={{
            position: "absolute",
            top: "clamp(16px, 4vw, 32px)",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="display" style={{ fontSize: 32, color: "#fff8ec" }}>
            {score}
          </div>
          {combo > 1 && phase === "playing" && (
            <div className="mono" style={{ fontSize: 12, color: "#ffc145", marginTop: 2 }}>
              COMBO x{combo}
            </div>
          )}
        </div>
      )}

      {phase === "ready" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            textAlign: "center",
            padding: 24,
          }}
        >
          <div className="display" style={{ fontSize: 42, color: "#fff8ec" }}>
            ASCEND
          </div>
          <button className="btn" onClick={handleAction}>
            Start
          </button>
          {best > 0 && (
            <div className="mono" style={{ fontSize: 11, color: "rgba(255,248,236,0.5)" }}>
              best: {best}
            </div>
          )}
        </div>
      )}

      {phase === "over" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            textAlign: "center",
            padding: 24,
            background: "rgba(18, 10, 31, 0.35)",
          }}
        >
          <div className="mono" style={{ fontSize: 12, color: "rgba(255,248,236,0.7)", letterSpacing: "0.2em" }}>
            TOWER FELL
          </div>
          <div className="display" style={{ fontSize: 38, color: "#fff8ec" }}>
            {score}
          </div>
          <div className="mono" style={{ fontSize: 12, color: "#ffc145" }}>
            best: {best}
          </div>
          <button className="btn" onClick={handleAction} style={{ marginTop: 8 }}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
