import type { mn } from './mn';

// The Mongolian dictionary with every text widened to string: keys, nesting and list lengths stay fixed,
// so en.ts and zh.ts are checked against it entry by entry.
type Widen<T> = T extends string ? string : { readonly [K in keyof T]: Widen<T[K]> };
export type Dictionary = Widen<typeof mn>;
