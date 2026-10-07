"use client";

import { Onest } from "next/font/google";
import Services from "./Services";
import MarketIntel from "./MarketIntel";
import Mining from "./Mining";
import Heatmap from "./Heatmap";
import About from "./About";
import StartCta from "./StartCta";
import { useSmoothScroll } from "../smoothScroll";
import s from "./home.module.css";

// Same face as the hero; cyrillic-ext carries Ө / Ү.
const onest = Onest({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-onest",
});

// Home page sections below the hero: Services → M Market Intelligence → Mining → Heatmap → About → CTA
export default function HomeSections() {
  useSmoothScroll();

  return (
    <div className={`${onest.variable} ${s.sections}`}>
      <Services />
      <MarketIntel />
      <Mining />
      <Heatmap />
      <About />
      <StartCta />
    </div>
  );
}
