# beehiiv → «Долоо хоногийн тойм» автомат синк

M Securities-ийн долоо хоног тутмын newsletter (beehiiv, `M securities's Newsletter`) нь
msecurities.mn-ийн **Судалгаа → Долоо хоногийн тойм** (`/research/weekly`) хэсэгт автоматаар орно.

## Хэрхэн ажилладаг

1. beehiiv API (`GET /v2/publications/{id}/posts?status=confirmed`)-аас нийтлэгдсэн дугааруудыг татна.
   Агуулгыг RSS → web → email HTML дарааллаар авна. Зөвхөн и-мэйлээр илгээсэн дугаарын хувьд email HTML-ийг ашиглана.
2. HTML-ийг сайтын Markdown формат руу хөрвүүлнэ (`src/app/components/research/Markdown.tsx`-ийн дэмждэг хэлбэр:
   гарчиг, догол мөр, жагсаалт, зураг, холбоос, тод/налуу).
   - Зургийн alt текстийг оруулахгүй (`![](url)`): сайт alt-ыг зургийн доор тайлбар болгон харуулдаг тул графикийн тоог давтдаг байсан.
     beehiiv-ийн жинхэнэ caption («Эх сурвалж: …») налуу мөр болж үлдэнэ.
   - «Powered by beehiiv» холбоос, unsubscribe/view online мэт footer мөрүүдийг хасна.
3. Supabase-ийн `public.posts` хүснэгтэд `kind = 'weekly'`, `status = 'published'` мөр болгон нэмнэ.
   - `title_mn`: beehiiv гарчиг (эмодзи хасна)
   - `slug`: гарчгаас латинаар (одоогийн `slugify`-тай ижил), жишээ `khurungiin-zakh-zeeliin-toim-2026-11-09-11-13`
   - `published_at`: beehiiv илгээсэн огноо (Улаанбаатарын цагаар)
   - `summary_mn`: beehiiv subtitle, байхгүй бол эхний догол мөр
   - `external_url`: beehiiv вэб хуудас (зөвхөн и-мэйл дугаарт хоосон)
4. **Давхардал үүсгэхгүй**: ижил `slug` эсвэл ижил `external_url`-тэй мөр байвал алгасна. Админаас гараар
   засварласан мөрийг хэзээ ч өөрчлөхгүй.
5. Хамгийн хуучнаас нь эхэлж оруулдаг тул жагсаалт огнооны дарааллаар байна.

Кодын хоёр хувилбар байгаа. **Аль нэгийг нь өдөр бүрийн хуваарьт ашиглахад хангалттай**, хоёулаа ажилласан ч давхардал үүсэхгүй.

| | A. Supabase Edge Function | B. Next.js (Vercel) |
|---|---|---|
| Файл | `supabase/functions/beehiiv-sync/index.ts` | `src/lib/beehiiv.ts`, `src/app/api/cron/beehiiv/route.ts`, `vercel.json` |
| Төлөв | **Deploy хийгдсэн** (`beehiiv-sync`) | Merge + env хэрэгтэй |
| Хуваарь | Supabase Cron (доор) | Vercel Cron, өдөр бүр 13:00 UTC (21:00 УБ) |
| Админ товч | — | «beehiiv-ээс татах», «Өмнөх бүгдийг татах» |

---

## A. Supabase Edge Function (одоо идэвхтэй)

Function: `https://ujqqljngplnlmszvercz.supabase.co/functions/v1/beehiiv-sync`

**Нэвтрэлт:** Settings → *Verify JWT with legacy secret* **унтраалттай**. Функц өөрөө шалгадаг: зөвхөн төслийн
**secret key** (`apikey: sb_secret_…` эсвэл `Authorization: Bearer …`) илгээсэн дуудлагыг зөвшөөрнө, бусад нь 401.

**Ажиллах горим:** анхдагчаар 202 хариуг шууд өгөөд ажлыг ар талд (`EdgeRuntime.waitUntil`) хийнэ — Supabase Cron-ийн
HTTP timeout дээд тал нь 5 сек. Үр дүнг харах бол `"wait": true` илгээнэ; ар талын ажлын дүн Logs-д `[beehiiv-sync]` гэж бичигдэнэ.

### Secrets (Edge Functions → Secrets)
| Нэр | Утга |
|---|---|
| `BEEHIIV_API_KEY` | beehiiv → Settings → API хэсэгт үүсгэсэн түлхүүр (**шалгах**: одоогийнх `INVALID_API_KEY` буцааж байна — шинээр үүсгэж солих) |
| `BEEHIIV_PUBLICATION_ID` | заавал биш, анхдагч `pub_ae5127fb-c0a8-44b7-a09a-606136473215` |

`SUPABASE_URL` болон service/secret key-ийг Supabase өөрөө өгдөг.

### Дуудах параметр (JSON body эсвэл query)
- `since`: `YYYY-MM-DD` — энэ өдрөөс хойш нийтлэгдсэнийг татна. Анхдагч: сүүлийн 30 хоног.
- `dry`: `true` — юу ч бичихгүй, юу нэмэгдэхийг харуулна (үр дүнг шууд буцаана).
- `wait`: `true` — ажлыг дуустал хүлээж үр дүнг буцаана.

### 1) Шалгах (dry run)
Dashboard → Edge Functions → beehiiv-sync → **Test** (Headers-д `apikey` = secret key нэмэх), body:
```json
{ "since": "2026-01-01", "dry": true }
```
`items[].action = "would-add"` мөрүүд, `preview` агуулгыг харна.

### 2) Өмнөх бүх дугаарыг нэг удаа оруулах
```json
{ "since": "2026-01-01", "wait": true }
```
✅ **2026-11-19-нд хийгдсэн:** 24 дугаар нэмэгдсэн, 2 нь өмнө байсан (08.31–09.04, 11.02–11.06).
Хариунд `added` / `exists` / `skipped` / `error` гэсэн жагсаалт ирнэ. Сайт ISR-ээр 5 минутын дотор шинэчлэгдэнэ.

### 3) Өдөр бүрийн хуваарь
✅ **Тохируулсан:** Integrations → Cron → job `beehiiv-sync-daily`, `0 13 * * *` (21:00 УБ), type *Supabase Edge Function*
→ `beehiiv-sync`, POST, timeout 5000 ms, header `apikey` = secret key (Supabase-ийн «Add secret key»). `pg_cron`, `pg_net` идэвхжүүлсэн.

### Код шинэчлэх
```bash
supabase functions deploy beehiiv-sync --project-ref ujqqljngplnlmszvercz
```

---

## B. Next.js / Vercel хувилбар

### Environment Variables (Vercel → Settings → Environment Variables)
| Нэр | Утга |
|---|---|
| `BEEHIIV_API_KEY` | beehiiv API key |
| `BEEHIIV_PUBLICATION_ID` | `pub_ae5127fb-c0a8-44b7-a09a-606136473215` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → service_role / secret (зөвхөн сервер талд) |
| `CRON_SECRET` | шинээр үүсгэсэн санамсаргүй утга, жишээ `openssl rand -hex 24` |
| `BEEHIIV_SYNC_SINCE` | заавал биш, анхдагч сүүлийн 30 хоног |
| `BEEHIIV_SYNC_STATUS` | заавал биш, `draft` бол нийтлэхгүй ноорог болгож оруулна |

Merge → redeploy. Vercel Cron `vercel.json`-оор `/api/cron/beehiiv`-г өдөр бүр дуудна
(`Authorization: Bearer $CRON_SECRET`; өөр хүн дуудвал 401).

Админ: `/admin/posts?kind=weekly` → **«Өмнөх бүгдийг татах»** (нэг удаа), **«beehiiv-ээс татах»** (сүүлийн 30 хоног).
Энэ товч нэвтэрсэн админы эрхээр (RLS) ажилладаг, service key шаардахгүй.

> Хэрэв A хувилбарыг ашиглах бол `vercel.json`-ийн cron-ыг хасаж болно; админ товчнууд B-ийн env (`BEEHIIV_API_KEY`) тохируулсан үед л ажиллана.

---

## Анхаарах зүйл
- 26 нийтлэгдсэн дугаараас 22 нь beehiiv дээр **зөвхөн и-мэйл** (вэб хуудасгүй) — агуулгыг email HTML-ээс авна.
  Эхний удаа оруулсны дараа хэдэн дугаарыг сайт дээр нүдээр шалгах нь зүйтэй.
- 04.27-ны дугаарын beehiiv гарчиг «N🚀 Никкей…» гэж эхэлдэг (илүү «N») — оруулсны дараа админаас засах.
- beehiiv ноорог (draft) дугаарууд орохгүй (`status=confirmed` л).
- beehiiv-ийн зургуудыг өөрсдийн CDN (`media.beehiiv.com`) холбоосоор харуулна; Supabase Storage руу хуулахгүй.
- 2026-11-19: импортолсон 24 дугаараас «Powered by beehiiv» ба зургийн alt тайлбарыг SQL-ээр цэвэрлэсэн
  (`kind='weekly' and created_at >= '2026-11-19'`).
- Зургийн хэмжээ жигд байх CSS засвар тусдаа: `src/app/components/research/prose.module.css` (PR #3) —
  нийтлэлийн бүх зураг баганын бүтэн өргөнтэй.
- Нууц түлхүүрүүдийг (beehiiv API key, service key, CRON_SECRET) чат, PR, кодонд бүү оруул.
