'use client';
import { Snowfall } from 'falling-snow/react';
import { useDarkMode } from '../context/DarkModeContext';

// Full-page snowfall (falling-snow). The canvas is pointer-events: none and aria-hidden, so it never
// blocks clicks or screen readers, and it pauses in hidden tabs / shows a still frame for reduced motion.
// The library's default flakes are white, which vanish on the light theme, so light mode gets a cool blue-grey.
const LIGHT_FLAKES = ['#b8cde0', '#cfe0ef', '#a7c4dd'];
const DARK_FLAKES = ['#ffffff', '#eaf4ff'];

// Snow season: November, December, January. getMonth() counts from 0 (0 = January), so 10 = Nov, 11 = Dec.
// The date is read in the visitor's browser, so from 1 February the effect turns itself off with no redeploy,
// and it comes back on 1 November.
const SNOW_MONTHS = [10, 11, 0];
export const isSnowSeason = (date = new Date()) => SNOW_MONTHS.includes(date.getMonth());

export default function SnowEffect() {
  const { isDarkMode } = useDarkMode();
  if (!isSnowSeason()) return null;
  // zIndex 40 keeps the snow under the navbar and its dropdowns (z-50).
  return <Snowfall fullScreen count={100} colors={isDarkMode ? DARK_FLAKES : LIGHT_FLAKES} zIndex={40} />;
}
