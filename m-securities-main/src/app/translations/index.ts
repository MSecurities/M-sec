import { en } from './en';
import { mn } from './mn';
import { zh } from './zh';
import type { Dictionary } from './types';

// Site texts in Mongolian, English and Chinese. The texts come from the shared translation sheet
// (M-Securities_орчуулга_MN-EN-ZH, platform "msecurities.mn"); its keys are the paths below, with
// list items as [n] (about.goal.items[0] ↔ about.goal.items.0).

export type { Dictionary };

export const LANGUAGES = ['mn', 'en', 'zh'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'mn';
export const isLanguage = (v: unknown): v is Language => LANGUAGES.includes(v as Language);

// BCP 47 tags for <html lang>
export const HTML_LANG: Record<Language, string> = { mn: 'mn', en: 'en', zh: 'zh-CN' };

export const translations: Record<Language, Dictionary> = { mn, en, zh };

// Every key path with the value it holds: ['faq.title', string], ['about.goal.items', readonly string[]], …
type Entry<T, P extends string = ''> = {
  [K in keyof T & (string | number)]: T[K] extends string | readonly unknown[]
    ? [`${P}${K}`, T[K]]
    : [`${P}${K}`, T[K]] | Entry<T[K], `${P}${K}.`>;
}[keyof T & (string | number)];
type Entries = Entry<Dictionary>;

/** Keys that hold a single text: what t() takes. */
export type TKey = Extract<Entries, [string, string]>[0];
/** Any key, lists and groups included: what get() takes. */
export type TPath = Entries[0];
export type TValue<P extends TPath> = Extract<Entries, [P, unknown]>[1];

export function lookup(dict: Dictionary, path: string): unknown {
  let v: unknown = dict;
  for (const k of path.split('.')) v = (v as Record<string, unknown> | undefined)?.[k];
  return v;
}
