"use client";
import { useEffect, useRef } from "react";

type Coconut = { x: number; y: number; speed: number; golden: boolean };
type Popup = { x: number; y: number; text: string; color: string; alpha: number };

export default function CatchCoconuts() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => root.querySelector(sel) as T;

    /* ── Constants ── */
    const W = 520, H = 440;
    const BW = 76, BH = 50;
    const CR = 15;
    const GROUND_H = 18, GROUND_Y = H - GROUND_H;
    const BASKET_Y = GROUND_Y - BH + 6;
    const GOLDEN_CHANCE = 0.12;
    const INIT_SI = 58, INIT_SPD = 2.0;
    const MIN_SI = 16, MAX_SPD = 7.5;
    const MOVE_SPD = 7, PAD = 10;

    /* ── DOM ── */
    const cvs = q<HTMLCanvasElement>('[data-el="cvs"]');
    const ctx = cvs.getContext("2d")!;
    const hud = q<HTMLDivElement>('[data-el="hud"]');
    const scorePill = q<HTMLDivElement>('[data-el="scorePill"]');
    const livesPill = q<HTMLDivElement>('[data-el="livesPill"]');
    const startOv = q<HTMLDivElement>('[data-el="startOverlay"]');
    const overOv = q<HTMLDivElement>('[data-el="overOverlay"]');
    const finalScoreEl = q<HTMLDivElement>('[data-el="finalScore"]');
    const bestLineEl = q<HTMLDivElement>('[data-el="bestLine"]');
    const newBestEl = q<HTMLDivElement>('[data-el="newBestLine"]');
    const btnPlay = q<HTMLButtonElement>('[data-el="btnPlay"]');
    const btnReplay = q<HTMLButtonElement>('[data-el="btnReplay"]');

    /* ── State ── */
    let status: "start" | "playing" | "over" = "start";
    let score = 0, lives = 3, bestScore = 0;
    let basketX = W / 2;
    let coconuts: Coconut[] = [], popups: Popup[] = [];
    let spawnTimer = 0, spawnInterval = INIT_SI, baseSpeed = INIT_SPD, diff = 0;
    let frame = 0, raf = 0;
    const keysDown: Record<string, boolean> = {};

    try {
      const rawBest = localStorage.getItem("thoppu_catch_best");
      if (rawBest) { const n = parseInt(rawBest, 10); if (!isNaN(n)) bestScore = n; }
    } catch { /* ignore */ }

    const clampX = (x: number) => Math.max(BW / 2, Math.min(W - BW / 2, x));

    function updateHUD() {
      scorePill.textContent = "🥥 " + score;
      let s = "";
      for (let i = 0; i < lives; i++) s += "🥥";
      for (let j = lives; j < 3; j++) s += "🖤";
      livesPill.textContent = s;
    }

    function spawn() {
      coconuts.push({
        x: CR + Math.random() * (W - CR * 2),
        y: -CR * 2,
        speed: baseSpeed + Math.random() * 1.2,
        golden: Math.random() < GOLDEN_CHANCE,
      });
    }

    function drawBasket(cx: number, cy: number) {
      const hw = BW / 2;
      const hwBot = hw - 10;
      const h = BH;
      ctx.save();
      ctx.translate(cx, cy);

      ctx.beginPath();
      ctx.ellipse(0, h + 2, hw + 4, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-hw, 0); ctx.lineTo(hw, 0);
      ctx.lineTo(hwBot, h); ctx.lineTo(-hwBot, h);
      ctx.closePath();
      const bodyGrad = ctx.createLinearGradient(-hw, 0, hw, 0);
      bodyGrad.addColorStop(0, "#A0724A");
      bodyGrad.addColorStop(0.3, "#C4935A");
      bodyGrad.addColorStop(0.5, "#D4A76A");
      bodyGrad.addColorStop(0.7, "#C4935A");
      bodyGrad.addColorStop(1, "#A0724A");
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.strokeStyle = "#7A5530";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.clip();
      const bandH = 7;
      for (let row = 0; row < h; row += bandH) {
        const isEven = (Math.floor(row / bandH) % 2 === 0);
        ctx.fillStyle = isEven ? "rgba(255,230,180,0.25)" : "rgba(90,50,20,0.15)";
        ctx.fillRect(-hw - 2, row, BW + 4, bandH);
        ctx.strokeStyle = "rgba(100,60,25,0.3)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(-hw - 2, row); ctx.lineTo(hw + 2, row);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(100,60,25,0.18)";
      ctx.lineWidth = 0.8;
      for (let vx = -hw + 5; vx < hw; vx += 10) {
        ctx.beginPath();
        ctx.moveTo(vx, 0); ctx.lineTo(vx * (hwBot / hw), h);
        ctx.stroke();
      }
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(-hw - 3, 0); ctx.lineTo(hw + 3, 0);
      ctx.lineTo(hw + 1, 5); ctx.lineTo(-hw - 1, 5);
      ctx.closePath();
      const rimGrad = ctx.createLinearGradient(0, 0, 0, 5);
      rimGrad.addColorStop(0, "#D4A76A");
      rimGrad.addColorStop(1, "#B08050");
      ctx.fillStyle = rimGrad;
      ctx.fill();
      ctx.strokeStyle = "#7A5530";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = "#8B6535";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-hw + 6, 2);
      ctx.bezierCurveTo(-hw + 2, -22, -hw + 28, -28, -hw + 30, -4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hw - 6, 2);
      ctx.bezierCurveTo(hw - 2, -22, hw - 28, -28, hw - 30, -4);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,220,160,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-hw + 7, 0);
      ctx.bezierCurveTo(-hw + 4, -20, -hw + 27, -25, -hw + 29, -3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hw - 7, 0);
      ctx.bezierCurveTo(hw - 4, -20, hw - 27, -25, hw - 29, -3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-hwBot, h); ctx.lineTo(hwBot, h);
      ctx.strokeStyle = "rgba(255,220,160,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    function tick() {
      frame++;
      if (keysDown["ArrowLeft"] || keysDown["a"]) basketX = clampX(basketX - MOVE_SPD);
      if (keysDown["ArrowRight"] || keysDown["d"]) basketX = clampX(basketX + MOVE_SPD);

      spawnTimer++;
      if (spawnTimer >= spawnInterval) { spawn(); spawnTimer = 0; }

      const bL = basketX - BW / 2 - PAD, bR = basketX + BW / 2 + PAD;
      const bT = BASKET_Y - PAD, bB = BASKET_Y + BH + PAD;
      const alive: Coconut[] = [];

      for (let i = 0; i < coconuts.length; i++) {
        const c = coconuts[i];
        c.y += c.speed;

        if (c.x >= bL && c.x <= bR && c.y >= bT && c.y <= bB) {
          const pts = c.golden ? 5 : 1;
          score += pts;
          popups.push({ x: c.x, y: c.y, text: "+" + pts, color: c.golden ? "#fbbf24" : "#ffffff", alpha: 1 });
          const nd = Math.floor(score / 10);
          if (nd > diff) {
            diff = nd;
            baseSpeed = Math.min(MAX_SPD, INIT_SPD + nd * 0.45);
            spawnInterval = Math.max(MIN_SI, INIT_SI - nd * 4);
          }
          continue;
        }

        if (c.y - CR > H) {
          lives--;
          if (lives <= 0) {
            lives = 0;
            if (score > bestScore) {
              bestScore = score;
              try { localStorage.setItem("thoppu_catch_best", String(score)); } catch { /* ignore */ }
            }
            status = "over";
            updateHUD();
            showGameOver();
            return;
          }
          continue;
        }
        alive.push(c);
      }
      coconuts = alive;

      const np: Popup[] = [];
      for (let p = 0; p < popups.length; p++) {
        popups[p].y -= 1.4;
        popups[p].alpha -= 0.022;
        if (popups[p].alpha > 0) np.push(popups[p]);
      }
      popups = np;
      updateHUD();
    }

    function draw() {
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#7DD3FC");
      sky.addColorStop(0.5, "#BBF7D0");
      sky.addColorStop(0.82, "#4ADE80");
      sky.addColorStop(1, "#166534");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      ctx.font = "46px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("☀️", W - 46, 40);

      ctx.globalAlpha = 0.55;
      ctx.font = "26px serif";
      ctx.fillText("☁️", 85, 28);
      ctx.fillText("☁️", 270, 20);
      ctx.fillText("☁️", 430, 34);
      ctx.globalAlpha = 1;

      const palm = (cx: number, topY: number) => {
        ctx.fillStyle = "#7C5A3C";
        ctx.beginPath();
        ctx.moveTo(cx - 7, topY + 20); ctx.lineTo(cx + 7, topY + 20);
        ctx.lineTo(cx + 5, GROUND_Y); ctx.lineTo(cx - 5, GROUND_Y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(60,30,10,0.25)";
        ctx.lineWidth = 1;
        for (let y = topY + 34; y < GROUND_Y - 8; y += 16) {
          ctx.beginPath(); ctx.moveTo(cx - 6, y); ctx.lineTo(cx + 6, y + 3); ctx.stroke();
        }
        ctx.font = "40px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🌴", cx, topY);
      };
      palm(58, 58);
      palm(W / 2 - 8, 44);
      palm(W - 58, 58);

      ctx.fillStyle = "#166534";
      ctx.fillRect(0, GROUND_Y, W, GROUND_H);
      ctx.fillStyle = "#22c55e";
      for (let gx = 4; gx < W; gx += 22) {
        ctx.beginPath(); ctx.moveTo(gx, GROUND_Y); ctx.lineTo(gx + 5, GROUND_Y - 7); ctx.lineTo(gx + 10, GROUND_Y); ctx.fill();
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const cf = (CR * 2.1) + "px serif";
      for (let i = 0; i < coconuts.length; i++) {
        const c = coconuts[i];
        if (c.golden) {
          const pulse = 0.3 + 0.15 * Math.sin(frame * 0.12);
          ctx.beginPath();
          ctx.arc(c.x, c.y, CR + 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(251,191,36," + pulse + ")";
          ctx.fill();
          ctx.font = cf;
          ctx.fillText("🥥", c.x, c.y);
          ctx.font = "12px serif";
          ctx.fillText("⭐", c.x + CR + 4, c.y - CR - 3);
        } else {
          ctx.font = cf;
          ctx.fillText("🥥", c.x, c.y);
        }
      }

      for (let p = 0; p < popups.length; p++) {
        const pp = popups[p];
        ctx.globalAlpha = Math.max(0, pp.alpha);
        ctx.font = "bold 20px sans-serif";
        ctx.strokeStyle = "#14532d";
        ctx.lineWidth = 3;
        ctx.strokeText(pp.text, pp.x, pp.y);
        ctx.fillStyle = pp.color;
        ctx.fillText(pp.text, pp.x, pp.y);
      }
      ctx.globalAlpha = 1;

      let bx = basketX;
      if (status === "start") bx = W / 2 + Math.sin(frame * 0.03) * 30;
      drawBasket(bx, BASKET_Y);
    }

    function loop() {
      if (status === "playing") tick();
      draw();
      raf = requestAnimationFrame(loop);
    }

    function startGame() {
      status = "playing";
      score = 0; lives = 3; basketX = W / 2;
      coconuts = []; popups = [];
      spawnTimer = 0; spawnInterval = INIT_SI; baseSpeed = INIT_SPD; diff = 0;
      startOv.classList.add("cc-hidden");
      overOv.classList.add("cc-hidden");
      hud.style.display = "flex";
      updateHUD();
    }

    function showGameOver() {
      hud.style.display = "none";
      finalScoreEl.textContent = String(score);
      bestLineEl.textContent = "Best: " + bestScore;
      if (score > 0 && score >= bestScore) newBestEl.classList.remove("cc-hidden");
      else newBestEl.classList.add("cc-hidden");
      overOv.classList.remove("cc-hidden");
    }

    /* ── Input ── */
    const onKeyDown = (e: KeyboardEvent) => {
      keysDown[e.key] = true;
      if (status === "playing" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { keysDown[e.key] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const onMouseMove = (e: MouseEvent) => {
      if (status !== "playing") return;
      const r = cvs.getBoundingClientRect();
      basketX = clampX((e.clientX - r.left) * (W / r.width));
    };
    cvs.addEventListener("mousemove", onMouseMove);

    const touchX = (t: Touch) => {
      const r = cvs.getBoundingClientRect();
      return clampX((t.clientX - r.left) * (W / r.width));
    };
    const onTouchStart = (e: TouchEvent) => {
      if (status !== "playing") return;
      basketX = touchX(e.touches[0]);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (status !== "playing") return;
      basketX = touchX(e.touches[0]);
    };
    cvs.addEventListener("touchstart", onTouchStart, { passive: true });
    cvs.addEventListener("touchmove", onTouchMove, { passive: false });

    btnPlay.addEventListener("click", startGame);
    btnReplay.addEventListener("click", startGame);

    raf = requestAnimationFrame(loop);

    /* ── Teardown ── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cvs.removeEventListener("mousemove", onMouseMove);
      cvs.removeEventListener("touchstart", onTouchStart);
      cvs.removeEventListener("touchmove", onTouchMove);
      btnPlay.removeEventListener("click", startGame);
      btnReplay.removeEventListener("click", startGame);
    };
  }, []);

  return (
    <div className="cc-wrap" ref={rootRef}>
      <div className="cc-title">Take a break — catch some coconuts!</div>
      <div className="cc-game-box">
        <canvas data-el="cvs" width={520} height={440} />
        <div className="cc-hud" data-el="hud" style={{ display: "none" }}>
          <div className="cc-hud-pill" data-el="scorePill">🥥 0</div>
          <div className="cc-hud-pill cc-lives" data-el="livesPill">🥥🥥🥥</div>
        </div>
        <div className="cc-overlay" data-el="startOverlay">
          <div className="cc-card">
            <div className="cc-emoji">🥥</div>
            <h3>Thoppu Catch 🥥</h3>
            <div className="cc-tamil">தோப்பு</div>
            <div className="cc-instructions">
              Move the basket to catch falling coconuts!<br />
              Normal = +1 · Golden ⭐ = +5<br />
              Miss = lose a life
            </div>
            <button className="cc-btn" data-el="btnPlay">▶&ensp;Play</button>
          </div>
        </div>
        <div className="cc-overlay cc-hidden" data-el="overOverlay">
          <div className="cc-card">
            <div className="cc-emoji">🌴</div>
            <div className="cc-game-over-sub">Game Over!</div>
            <div className="cc-score-big" data-el="finalScore">0</div>
            <div className="cc-score-label">points</div>
            <div className="cc-best-line" data-el="bestLine">Best: 0</div>
            <div className="cc-new-best cc-hidden" data-el="newBestLine">🎉 New Best Score! 🎉</div>
            <button className="cc-btn" data-el="btnReplay">Play Again</button>
          </div>
        </div>
      </div>
      <div className="cc-footer">🌴 A little fun from Thoppu — your farm, in your palm.</div>

      <style jsx>{`
        .cc-wrap, .cc-wrap :global(*) { box-sizing: border-box; }
        .cc-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; width: 100%; max-width: 520px; margin: 0 auto;
          user-select: none; -webkit-user-select: none;
        }
        .cc-title { font-size: 1.15rem; font-weight: 700; color: #166534; text-align: center; line-height: 1.4; }
        .cc-game-box {
          position: relative; width: 100%; max-width: 520px;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,.12);
          border: 2px solid rgba(34,197,94,.4);
        }
        .cc-game-box :global(canvas) { display: block; width: 100%; height: auto; touch-action: none; }
        .cc-hud {
          position: absolute; top: 0; left: 0; right: 0;
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 12px; pointer-events: none;
        }
        .cc-hud-pill {
          background: rgba(0,0,0,.3); backdrop-filter: blur(6px);
          border-radius: 12px; padding: 6px 12px; color: #fff; font-weight: 700; font-size: 14px;
        }
        .cc-lives { font-size: 15px; letter-spacing: 2px; }
        .cc-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,.2); backdrop-filter: blur(1px);
        }
        .cc-overlay.cc-hidden { display: none; }
        .cc-card {
          background: rgba(254,252,232,.96); border-radius: 16px;
          padding: 28px 28px 24px; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
          border: 1px solid rgba(34,197,94,.3); margin: 0 20px; max-width: 320px; width: 100%;
        }
        .cc-emoji { font-size: 40px; margin-bottom: 4px; }
        .cc-card h3 { font-size: 22px; font-weight: 800; color: #166534; line-height: 1.2; margin-bottom: 2px; }
        .cc-tamil { font-size: 13px; color: rgba(22,101,52,.55); letter-spacing: 1px; margin-bottom: 12px; }
        .cc-instructions {
          font-size: 12px; color: rgba(22,101,52,.5); line-height: 1.6; margin-bottom: 20px;
          max-width: 240px; margin-left: auto; margin-right: auto;
        }
        .cc-score-big { font-size: 36px; font-weight: 900; color: #15803d; margin: 4px 0 0; }
        .cc-score-label { font-size: 11px; color: rgba(22,101,52,.45); margin-bottom: 4px; }
        .cc-best-line { font-size: 13px; color: rgba(22,101,52,.55); margin-bottom: 2px; }
        .cc-new-best { font-size: 13px; font-weight: 700; color: #d97706; margin-bottom: 8px; animation: cc-pulse 1s infinite; }
        .cc-new-best.cc-hidden { display: none; }
        @keyframes cc-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .cc-btn {
          display: inline-block; background: #15803d; color: #fff; font-size: 17px; font-weight: 700;
          padding: 12px 40px; border-radius: 16px; border: none; cursor: pointer;
          box-shadow: 0 4px 12px rgba(21,128,61,.3); transition: background .15s, transform .1s; margin-top: 8px;
        }
        .cc-btn:hover { background: #166534; }
        .cc-btn:active { transform: scale(.95); }
        .cc-btn:focus { outline: 2px solid #22c55e; outline-offset: 2px; }
        .cc-footer { font-size: 11px; color: rgba(22,101,52,.38); text-align: center; }
        .cc-game-over-sub { font-size: 20px; font-weight: 800; color: #166534; margin-bottom: 8px; }
      `}</style>
    </div>
  );
}
