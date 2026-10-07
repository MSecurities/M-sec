"use client";

import { useEffect, useRef } from "react";
import { DOTS, MON, COAST, MNB } from "./globe-data";
import s from "./Hero.module.css";

// Scroll-driven camera written by the hero dive: K 0 → 1 zooms in on Mongolia;
// covered pauses rendering once the hero has scrolled away (reference window.__camK / __heroCovered).
export type GlobeCamera = { K: number; covered: boolean };

// Horizon globe with return-flow arcs into Mongolia.
// Ported 1:1 from the GLOBE block of reference/msecurities-hero.html; only the
// setup/teardown is React-specific.
export default function HeroGlobe({ cam, canvasRef }: { cam: { current: GlobeCamera }; canvasRef?: { current: HTMLCanvasElement | null } }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (canvasRef) canvasRef.current = ref.current;
    return startGlobe(ref.current, s.drag, cam);
  }, [cam, canvasRef]);

  return (
    <canvas
      ref={ref}
      className={s.globe}
      role="img"
      aria-label="Монголоос дэлхийн санхүүгийн төвүүд рүү татсан гүүрэн холбоостой эргэдэг бөмбөрцөг"
    />
  );
}

type Vec3 = [number, number, number];
type Dest = { v: Vec3; delay: number; off: number; rip: number; lp: number; pts: Vec3[] };

const RAD = Math.PI / 180, TAU = Math.PI * 2;

function startGlobe(cvs: HTMLCanvasElement, dragClass: string, cam: { current: GlobeCamera }): () => void {
  const ctx = cvs.getContext("2d");
  if (!ctx) return () => {};
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // tokens are defined on the hero section and inherited by the canvas
  const css = (n: string) => getComputedStyle(cvs).getPropertyValue(n).trim();

  const n = DOTS.length / 2, V = new Float32Array(n * 3), isMN = new Uint8Array(n), SX = new Float32Array(n), SY = new Float32Array(n), DL = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const la = DOTS[2 * i] * RAD, lo = DOTS[2 * i + 1] * RAD;
    V[3 * i] = Math.cos(la) * Math.sin(lo); V[3 * i + 1] = Math.sin(la); V[3 * i + 2] = Math.cos(la) * Math.cos(lo);
    SX[i] = (Math.random() - .5) * 2.4; SY[i] = .3 + Math.random() * 1.2; DL[i] = Math.random() * .6;
  }
  MON.forEach(i => (isMN[i] = 1));
  const toV = (arr: number[]) => {
    const o = new Float32Array(arr.length / 2 * 3);
    for (let k = 0; k < arr.length / 2; k++) {
      const la = arr[2 * k] * RAD, lo = arr[2 * k + 1] * RAD;
      o[3 * k] = Math.cos(la) * Math.sin(lo); o[3 * k + 1] = Math.sin(la); o[3 * k + 2] = Math.cos(la) * Math.cos(lo);
    }
    return o;
  };
  const COASTV = COAST.map(toV), MNBV = MNB.map(toV);
  const GRAT: Float32Array[] = [];
  for (let la = -75; la <= 75; la += 15) { const a: number[] = []; for (let lo = -180; lo <= 180; lo += 3) a.push(la, lo); GRAT.push(toV(a)); }
  for (let lo = -180; lo < 180; lo += 15) { const a: number[] = []; for (let la = -84; la <= 84; la += 3) a.push(la, lo); GRAT.push(toV(a)); }

  let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1, R0 = 0, MOB = false;
  const TILT = .17; const ct = Math.cos(TILT), st = Math.sin(TILT); let cr = 1, sr = 0;
  function proj(x: number, y: number, z: number): Vec3 { const X = x * cr + z * sr, Z0 = -x * sr + z * cr; return [X, y * ct - Z0 * st, y * st + Z0 * ct]; }
  function line(v: Float32Array) {
    let on = false;
    for (let k = 0; k < v.length / 3; k++) {
      const p = proj(v[3 * k], v[3 * k + 1], v[3 * k + 2]); const x = cx + p[0] * R, y = cy - p[1] * R;
      if (p[2] > 0.0) { if (on) ctx!.lineTo(x, y); else ctx!.moveTo(x, y); on = true; } else on = false;
    }
  }
  const vec = (la: number, lo: number): Vec3 => [Math.cos(la * RAD) * Math.sin(lo * RAD), Math.sin(la * RAD), Math.cos(la * RAD) * Math.cos(lo * RAD)];
  const HOME = vec(47.92, 106.92);
  const DEST: Dest[] = [[40.71, -74.0], [51.5, -0.12], [50.11, 8.68], [35.68, 139.69], [22.32, 114.17], [1.35, 103.82]]
    .map(([la, lo], i) => ({ v: vec(la, lo), delay: 2.0 + i * .2, off: i / 6 + .05, rip: -9, lp: 0, pts: [] }));
  DEST.forEach(c => {
    const a = HOME, b = c.v, d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], w = Math.acos(Math.max(-1, Math.min(1, d))), sn = Math.sin(w), lift = Math.min(.26, .14 * w);
    for (let k = 0; k <= 80; k++) {
      const t = k / 80, f1 = Math.sin((1 - t) * w) / sn, f2 = Math.sin(t * w) / sn, h = 1 + lift * Math.sin(Math.PI * t);
      c.pts.push([(a[0] * f1 + b[0] * f2) * h, (a[1] * f1 + b[1] * f2) * h, (a[2] * f1 + b[2] * f2) * h]);
    }
  });

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = cvs.clientWidth; H = cvs.clientHeight; cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
    const mob = W < 700; R0 = mob ? Math.max(W * .78, 300) : Math.max(W * .42, 540); MOB = mob; R = R0; cx = W / 2; cy = H + R * (mob ? .15 : .25);
  }
  size(); addEventListener("resize", size);

  const yaw0 = -106.92 * RAD; let dragYaw = 0, vel = 0, smx = 0, mx = 0, dragging = false, lastX = 0;
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; vel = 0; cvs.classList.add(dragClass); cvs.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; dragYaw += dx * .0035; vel = dx * .0035; };
  const end = () => { dragging = false; cvs.classList.remove(dragClass); };
  const onWinMove = (e: PointerEvent) => { mx = e.clientX / innerWidth - .5; };
  cvs.addEventListener("pointerdown", onDown); cvs.addEventListener("pointermove", onMove);
  cvs.addEventListener("pointerup", end); cvs.addEventListener("pointercancel", end);
  addEventListener("pointermove", onWinMove);

  let visible = true; const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }); io.observe(cvs);
  let C = { dot: "", gold: "" }, dark = false;
  function readC() { C = { dot: css("--dot"), gold: css("--dotgold") }; dark = root.classList.contains("dark"); }
  readC(); const mo = new MutationObserver(readC); mo.observe(root, { attributes: true, attributeFilter: ["class"] });

  const LX = -.35, LY = .75, LZ = .55, LL = Math.hypot(LX, LY, LZ);
  let mnGlow = 0, lastHit = -9; const sparks: { t: number; vx: number; vy: number }[] = []; let nowT = 0;
  function arrive() { mnGlow = 1; lastHit = nowT; for (let k = 0; k < 7; k++) { const a = Math.random() * TAU, v = .25 + Math.random() * .55; sparks.push({ t: nowT, vx: Math.cos(a) * v, vy: Math.sin(a) * v * .7 - .25 }); } }

  const t0 = performance.now();
  let raf = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame); if (!visible || !W || cam.current.covered) return;
    const c2 = ctx!;
    const t = (now - t0) / 1000; nowT = t; mnGlow *= .965;
    const K = cam.current.K;
    { const R1 = R0 * (MOB ? 1.35 : 1.6); R = R0 + (R1 - R0) * K; const c0 = H + R0 * (MOB ? .15 : .25), c1 = H * .52 + R * .6; cy = c0 + (c1 - c0) * K; }
    if (!dragging) { dragYaw += vel; vel *= .94; }
    smx += (mx - smx) * .04;
    const yaw = yaw0 + dragYaw + (reduced ? 0 : Math.sin(t * .07) * .32) * (1 - K) + smx * .12; cr = Math.cos(yaw); sr = Math.sin(yaw);
    c2.setTransform(dpr, 0, 0, dpr, 0, 0); c2.clearRect(0, 0, W, H);
    const intro = reduced ? 1 : Math.min(1, Math.max(0, (t - .25) / 2.3));
    // atmosphere halo
    let g = c2.createRadialGradient(cx, cy, R * .96, cx, cy, R * 1.22);
    g.addColorStop(0, "rgba(" + C.dot + "," + (dark ? .35 : .28) * intro + ")"); g.addColorStop(.35, "rgba(" + C.dot + "," + (dark ? .10 : .08) * intro + ")"); g.addColorStop(1, "rgba(" + C.dot + ",0)");
    c2.fillStyle = g; c2.beginPath(); c2.arc(cx, cy, R * 1.22, 0, TAU); c2.fill();
    // body
    g = c2.createRadialGradient(cx, cy - R * .9, R * .05, cx, cy, R);
    g.addColorStop(0, dark ? "rgba(" + C.dot + ",.16)" : "rgba(255,255,255,.95)"); g.addColorStop(.6, dark ? "rgba(8,30,40,.92)" : "rgba(236,250,247,.96)"); g.addColorStop(1, dark ? "rgba(6,22,32,.96)" : "rgba(214,244,238,.96)");
    c2.globalAlpha = intro; c2.fillStyle = g; c2.beginPath(); c2.arc(cx, cy, R, 0, TAU); c2.fill(); c2.globalAlpha = 1;
    // graticule
    const lineA = reduced ? 1 : Math.max(0, Math.min(1, (t - 1.6) / 1.2));
    if (lineA > 0) { c2.lineWidth = .6; c2.strokeStyle = "rgba(" + C.dot + "," + (dark ? .10 : .13) * lineA + ")"; c2.beginPath(); GRAT.forEach(v => line(v)); c2.stroke(); }
    // dots
    c2.fillStyle = "rgb(" + C.dot + ")"; const mn: [number, number, number, number][] = [];
    for (let i = 0; i < n; i++) {
      const p = proj(V[3 * i], V[3 * i + 1], V[3 * i + 2]); if (p[2] <= 0) continue;
      let x = cx + p[0] * R, y = cy - p[1] * R; if (y > H + 4 || x < -4 || x > W + 4) continue;
      let a = 1;
      if (intro < 1) {
        const e = Math.max(0, Math.min(1, intro * 1.6 - DL[i])), ee = 1 - Math.pow(1 - e, 3); if (ee <= 0) continue;
        const sx = cx + SX[i] * W * .5, sy = H + SY[i] * H * .4; x = sx + (x - sx) * ee; y = sy + (y - sy) * ee; a = ee;
      }
      if (isMN[i]) { mn.push([x, y, p[2], a]); continue; }
      const sh = Math.max(0, (p[0] * LX + p[1] * LY + p[2] * LZ) / LL);
      c2.globalAlpha = a * ((dark ? .25 : .3) + .6 * sh); const s = .42 + .62 * p[2];
      c2.fillRect(x - s, y - s, s * 2, s * 2);
    }
    c2.fillStyle = "rgb(" + C.gold + ")";
    mn.forEach(([x, y, z, a]) => { c2.globalAlpha = a; const s = .6 + .7 * z; c2.fillRect(x - s, y - s, s * 2, s * 2); });
    c2.globalAlpha = 1;
    // coastlines
    if (lineA > 0) {
      c2.lineWidth = .9; c2.lineJoin = "round"; c2.strokeStyle = "rgba(" + C.dot + "," + (dark ? .45 : .5) * lineA + ")"; c2.beginPath(); COASTV.forEach(v => line(v)); c2.stroke();
      // Mongolia border + fill
      c2.beginPath(); MNBV.forEach(v => line(v)); c2.fillStyle = "rgba(" + C.gold + "," + ((dark ? .14 : .16) + mnGlow * (dark ? .22 : .2)) * lineA + ")"; c2.fill();
      c2.shadowColor = "rgba(" + C.gold + "," + (dark ? .9 : .6) + ")"; c2.shadowBlur = (dark ? 10 : 0) + mnGlow * 14;
      c2.lineWidth = 1.7; c2.strokeStyle = "rgba(" + C.gold + "," + .95 * lineA + ")"; c2.stroke(); c2.shadowBlur = 0;
    }
    c2.globalAlpha = 1;
    // rim
    g = c2.createRadialGradient(cx, cy, R * .86, cx, cy, R * 1.005);
    g.addColorStop(0, "rgba(" + C.dot + ",0)"); g.addColorStop(1, "rgba(" + C.dot + "," + (dark ? .45 : .35) * intro + ")");
    c2.fillStyle = g; c2.beginPath(); c2.arc(cx, cy, R, 0, TAU); c2.fill();
    // arcs — returns flow FROM the world INTO Mongolia
    const hp = proj(HOME[0], HOME[1], HOME[2]), hx = cx + hp[0] * R, hy = cy - hp[1] * R;
    if (dark) c2.globalCompositeOperation = "lighter";
    DEST.forEach(c => {
      const prog = reduced ? 1 : Math.max(0, Math.min(1, (t - c.delay) / 1.3)); if (prog <= 0) return;
      const first = 80 - Math.floor((1 - Math.pow(1 - prog, 3)) * 80), sp: [number, number, boolean][] = new Array(81);
      for (let k = first; k <= 80; k++) { const q = c.pts[k], p = proj(q[0], q[1], q[2]); sp[k] = [cx + p[0] * R, cy - p[1] * R, (p[2] > 0) || (p[0] * p[0] + p[1] * p[1] > 1)]; }
      const cp = proj(c.v[0], c.v[1], c.v[2]), ex = cx + cp[0] * R, ey = cy - cp[1] * R;
      const lg = c2.createLinearGradient(ex, ey, hx, hy); lg.addColorStop(0, "rgba(" + C.dot + ",.55)"); lg.addColorStop(1, "rgba(" + C.gold + ",.9)");
      c2.strokeStyle = lg; c2.lineWidth = 1.4; c2.beginPath(); let on = false;
      for (let k = 80; k >= first; k--) { const q = sp[k]; if (q[2]) { if (on) c2.lineTo(q[0], q[1]); else c2.moveTo(q[0], q[1]); on = true; } else on = false; } c2.stroke();
      // returns travelling home: teal at the source, turning gold as they arrive
      if (prog >= 1 && !reduced) {
        const ph = (t * .3 + c.off) % 1;
        if (ph < c.lp) { c.rip = t; arrive(); } c.lp = ph;
        const e = ph * ph * (3 - 2 * ph), head = 80 - e * 80;
        for (let j = 0; j < 18; j++) {
          const idx = Math.round(head) + j; const q = sp[idx]; if (!q || !q[2]) continue; const f = 1 - j / 18, mix = 1 - idx / 80;
          c2.globalAlpha = f; c2.fillStyle = j < 2 && dark ? "#fff" : (mix > .5 ? "rgb(" + C.gold + ")" : "rgb(" + C.dot + ")");
          c2.beginPath(); c2.arc(q[0], q[1], (2 + mix * 1.2) * f + .4, 0, TAU); c2.fill();
        }
        c2.globalAlpha = 1;
      }
      if (prog >= 1 && cp[2] > 0) {
        c2.fillStyle = "rgb(" + C.dot + ")"; c2.beginPath(); c2.arc(ex, ey, 3, 0, TAU); c2.fill();
        const ph = (t * .3 + c.off) % 1; if (ph < .12) { const r = ph / .12; c2.strokeStyle = "rgba(" + C.dot + "," + (1 - r) * .8 + ")"; c2.lineWidth = 1.3; c2.beginPath(); c2.arc(ex, ey, 3 + r * 12, 0, TAU); c2.stroke(); }
      }
    });
    // arrival sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i], age = t - p.t; if (age > 1) { sparks.splice(i, 1); continue; }
      const x = hx + p.vx * age * 60 * (1 - age * .5), y = hy + p.vy * age * 60 * (1 - age * .5) + age * age * 14;
      c2.globalAlpha = (1 - age); c2.fillStyle = "rgb(" + C.gold + ")"; c2.beginPath(); c2.arc(x, y, 1.8 * (1 - age) + .3, 0, TAU); c2.fill();
    }
    c2.globalAlpha = 1;
    c2.globalCompositeOperation = "source-over";
    // home beacon
    if (hp[2] > 0 && intro > .6) {
      const a = Math.min(1, (intro - .6) * 2.5), pr = (t * .55) % 1; c2.globalAlpha = a;
      c2.strokeStyle = "rgba(" + C.gold + "," + (1 - pr) * .85 + ")"; c2.lineWidth = 1.6; c2.beginPath(); c2.arc(hx, hy, 6 + pr * 26, 0, TAU); c2.stroke();
      const ha = t - lastHit; if (ha < .9) { const r = ha / .9; c2.strokeStyle = "rgba(" + C.gold + "," + (1 - r) + ")"; c2.lineWidth = 2.2 * (1 - r) + .4; c2.beginPath(); c2.arc(hx, hy, 8 + r * 40, 0, TAU); c2.stroke(); }
      c2.fillStyle = "rgba(" + C.gold + ",.22)"; c2.beginPath(); c2.arc(hx, hy, 11, 0, TAU); c2.fill();
      c2.fillStyle = "rgb(" + C.gold + ")"; c2.beginPath(); c2.arc(hx, hy, 5 + mnGlow * 1.8, 0, TAU); c2.fill();
      c2.fillStyle = "#fff"; c2.beginPath(); c2.arc(hx, hy, 1.8, 0, TAU); c2.fill(); c2.globalAlpha = 1;
    }
  }
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("resize", size);
    removeEventListener("pointermove", onWinMove);
    cvs.removeEventListener("pointerdown", onDown); cvs.removeEventListener("pointermove", onMove);
    cvs.removeEventListener("pointerup", end); cvs.removeEventListener("pointercancel", end);
    io.disconnect(); mo.disconnect();
  };
}
