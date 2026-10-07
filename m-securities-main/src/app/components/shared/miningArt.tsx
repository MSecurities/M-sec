import type { ReactNode } from "react";

const line = { stroke: "var(--line)" };

// Product illustrations (coal, copper concentrate, iron ore, other minerals) shared by the home
// mining section and the mining broker page; `spark` is the caller's twinkle animation class.
export const miningArt = (spark: string): ReactNode[] => [
  // coal
  <>
    <path d="M14 50 24 34l14-4 8 10-6 14H20Z" fill="#2B3341" />
    <path d="M38 30l14-6 14 8 2 14-10 10H44l2-10Z" fill="#3A4454" />
    <path d="M28 54l6-10 12 2 4 10Z" fill="#1E242F" />
    <path d="M24 34l14-4 2 6-12 4Z M52 24l14 8-6 4-10-6Z" fill="#5B6678" opacity=".7" />
    <path d="M8 58h68" style={line} strokeWidth="2" strokeLinecap="round" />
  </>,
  // copper concentrate
  <>
    <defs><linearGradient id="mine-cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9A066" /><stop offset="1" stopColor="#A2552A" /></linearGradient></defs>
    <path d="M10 56C20 30 32 18 42 18s22 12 32 38Z" fill="url(#mine-cu)" />
    <path d="M30 34c4-6 8-9 12-9" stroke="#F8C79E" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".8" />
    <circle className={spark} cx="54" cy="30" r="2" fill="#FFE2C4" />
    <circle className={spark} cx="36" cy="44" r="1.6" fill="#FFE2C4" style={{ animationDelay: ".7s" }} />
    <circle className={spark} cx="60" cy="46" r="1.4" fill="#FFE2C4" style={{ animationDelay: "1.4s" }} />
    <path d="M6 58h72" style={line} strokeWidth="2" strokeLinecap="round" />
  </>,
  // iron ore
  <>
    <path d="M16 52 22 30l16-8 10 14-4 18Z" fill="#7A4A3C" />
    <path d="M44 54l4-18 14-8 12 10-2 16Z" fill="#5E6672" />
    <path d="M22 30l16-8 4 6-14 6Z" fill="#A86B52" />
    <path d="M48 36l14-8 4 5-12 7Z" fill="#8892A0" />
    <path d="M30 40l6 2M56 44l5-2" stroke="#C98F72" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 58h68" style={line} strokeWidth="2" strokeLinecap="round" />
  </>,
  // other minerals (coming soon)
  <>
    <path d="M30 54 24 30l10-14 10 14-6 24Z" style={{ fill: "rgba(var(--dot),.35)", stroke: "var(--teal)" }} strokeWidth="1.5" />
    <path d="M48 54l-4-18 8-12 8 12-4 18Z" style={{ fill: "rgba(var(--dotgold),.35)", stroke: "var(--gold)" }} strokeWidth="1.5" />
    <path d="M34 16v38M52 24v30" stroke="rgba(255,255,255,.35)" strokeWidth="1" />
    <path d="M8 58h68" style={line} strokeWidth="2" strokeLinecap="round" />
  </>,
];
