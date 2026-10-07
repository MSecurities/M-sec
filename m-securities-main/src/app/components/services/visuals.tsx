"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import s from "./kit.module.css";

/* ---------- coming soon: the page being assembled ---------- */
export function Skeleton({ label }: { label: string }) {
  return (
    <>
      <span className={s.dlabel}><i></i>{label}</span>
      <div className={s.skel} aria-hidden="true">
        <div className={s["sk-row"]}><span className={s.sk} style={{ width: "40%", height: 34 }} /><span className={s.sk} style={{ width: 90, height: 34, marginLeft: "auto", borderRadius: 999 }} /></div>
        <div className={s["sk-row"]} style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <span className={s.sk} style={{ width: "72%", height: 14 }} /><span className={s.sk} style={{ width: "54%", height: 14 }} />
        </div>
        <div className={s["sk-cards"]}><span className={s.sk} /><span className={s.sk} /><span className={s.sk} /></div>
      </div>
      <span className={s.scan} aria-hidden="true" />
    </>
  );
}

/* ---------- foreign: exchange clock board ---------- */
export type Market = { name: string; country: string; desc: string; tz: string };
const timeIn = (d: Date, tz: string) => {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "shortOffset" }).formatToParts(d);
  const get = (t: string) => p.find(x => x.type === t)?.value ?? "";
  return { h: get("hour"), m: get("minute"), off: get("timeZoneName") };
};
// Local time at each exchange (minute precision, refreshed while mounted); filled in after mount so
// server and client markup match.
export function ClockBoard({ markets, ubLabel }: { markets: Market[]; ubLabel: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);
  const ub = now && timeIn(now, "Asia/Ulaanbaatar");

  return (
    <>
      <p className={`${s.ub} ${s.rv}`} style={{ "--d": 2 } as CSSProperties}>{ubLabel} <b>{ub ? `${ub.h}:${ub.m}` : "--:--"}</b></p>
      <div className={s.board}>
        {markets.map((m, i) => {
          const t = now && timeIn(now, m.tz);
          const pos = t ? ((+t.h + +t.m / 60) / 24) * 100 : 50;
          return (
            <div key={m.name} className={`${s.ex} ${s.sweep} ${s.rv}`} style={{ "--d": i + 3 } as CSSProperties}>
              <div className={s.eh}>
                <span className={s.flag}><img src={`https://flagcdn.com/w160/${m.country}.png`} alt={m.country.toUpperCase()} loading="lazy" /></span>
                <span><b>{m.name}</b><small>{m.desc}</small></span>
              </div>
              <div className={s.clock}>
                <span>{t ? t.h : "--"}<span className={s.colon}>:</span>{t ? t.m : "--"}</span>
                <em>{t?.off}</em>
              </div>
              <div className={s.day} aria-hidden="true"><i style={{ left: `${pos}%` }} /></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
