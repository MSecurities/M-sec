'use client';
import type { ReactNode } from 'react';
import { cssVars, useTr } from '../components/services/parts';
import s from './team.module.css';

type Member = { name: string; position: string };
type Role = 'ceo' | 'accountant' | 'legal' | 'it' | 'broker';
// Order matches about.team.list in the translations: gender picks the silhouette, role the badge icon
const META: { g: 'm' | 'f'; role: Role }[] = [
  { g: 'm', role: 'ceo' },
  { g: 'f', role: 'accountant' },
  { g: 'm', role: 'legal' },
  { g: 'm', role: 'it' },
  { g: 'f', role: 'broker' },
  { g: 'm', role: 'broker' },
  { g: 'm', role: 'broker' },
  { g: 'm', role: 'broker' },
  { g: 'm', role: 'broker' },
  { g: 'f', role: 'broker' },
];

const ROLE_ICON: Record<Role, ReactNode> = {
  ceo: <path d="M2.5 6.5 6 9l3-5.5L12 9l3.5-2.5-1.3 8h-10.4z" />,
  accountant: <><rect x="3.5" y="2" width="11" height="14" rx="2" /><path d="M6 5.5h6M6.2 9h.1M9 9h.1M11.8 9h.1M6.2 12.3h.1M9 12.3h.1M11.8 12.3h.1" /></>,
  legal: <path d="M9 2.5v13M5 15.5h8M3.5 5h11M5.5 5 3 10.5a2.5 2.5 0 0 0 5 0zM12.5 5 10 10.5a2.5 2.5 0 0 0 5 0z" />,
  it: <path d="M6 5 2.5 9 6 13M12 5l3.5 4-3.5 4M10.2 3.5 7.8 14.5" />,
  broker: <path d="M2.5 12.5 6.5 8.5 9 11l5.5-6M10.5 5h4v4" />,
};
const Icon = ({ role, size = 16 }: { role: Role; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ROLE_ICON[role]}</svg>
);

// No photos: a calm bust silhouette in the brand tint (long hair for women, short for men). Head, neck and
// shoulders share one solid fill so they read as a single shape.
function Avatar({ g }: { g: 'm' | 'f' }) {
  const f = g === 'f';
  return (
    <svg className={s.sil} viewBox="0 0 120 120" aria-hidden="true">
      {f && <path className={s.hair} d="M37 50C36 30 47 23 60 23s24 7 23 27l3 32c-6 6-46 6-52 0z" />}
      <path className={s.skin} d={f ? 'M25 121c2-25 16-38 35-38s33 13 35 38zM53 64h14v21c-4 3-10 3-14 0z' : 'M16 121c2-28 19-41 44-41s42 13 44 41zM50 63h20v19c-5 4-15 4-20 0z'} />
      <circle className={s.skin} cx="60" cy={f ? 49 : 48} r={f ? 18 : 20} />
      <path className={s.hair} d={f
        ? 'M42 49c0-14 8-22 19-22 10 0 17 6 17 17-8-6-20-7-30-1-3 2-5 4-6 6z'
        : 'M40 48c-2-18 8-24 20-24s22 6 20 24c-3-8-10-13-20-13s-17 5-20 13z'} />
    </svg>
  );
}

function Card({ m, meta, k }: { m: Member; meta: (typeof META)[number]; k: number }) {
  return (
    <article className={s.card} data-card style={cssVars({ '--k': k })}>
      <div className={s.av}>
        <Avatar g={meta.g} />
        <span className={s.badge}><Icon role={meta.role} size={15} /></span>
      </div>
      <div className={s.tx}>
        <h4>{m.name}</h4>
        <p>{m.position}</p>
      </div>
    </article>
  );
}

// The team block of the About page: CEO on a wide card, then specialists and brokers
export function TeamSection() {
  const { t, tr } = useTr();
  const list = (t('about.team.list') as unknown as Member[]) ?? [];
  const members = list.map((m, i) => ({ m, meta: META[i] ?? { g: 'm' as const, role: 'broker' as const } }));
  const [lead, ...rest] = members;
  const specialists = rest.filter(x => x.meta.role !== 'broker');
  const brokers = rest.filter(x => x.meta.role === 'broker');

  return (
    <div className={s.body}>
        {lead && (
          <section data-io className={s.group} aria-labelledby="team-lead">
            <h3 id="team-lead" className={s.gh}><Icon role="ceo" size={15} />{tr('Удирдлага', 'Leadership', '管理层')}</h3>
            <article className={s.lead} data-card>
              <div className={s['lead-av']}>
                <Avatar g={lead.meta.g} />
              </div>
              <div className={s['lead-tx']}>
                <span className={s.pos}>{lead.m.position}</span>
                <h4>{lead.m.name}</h4>
                <span className={s.rule} />
                <span className={s.org}>{tr('М Секьюритис ҮЦК', 'M Securities SC', 'M Securities 证券公司')}</span>
              </div>
              <span className={s.wm} aria-hidden="true">M</span>
            </article>
          </section>
        )}

        {specialists.length > 0 && (
          <section data-io className={s.group} aria-labelledby="team-spec">
            <h3 id="team-spec" className={s.gh}><Icon role="legal" size={15} />{tr('Мэргэжилтнүүд', 'Specialists', '专业人员')}<em>{specialists.length}</em></h3>
            <div className={`${s.grid} ${s.three}`}>
              {specialists.map((x, k) => <Card key={x.m.name} m={x.m} meta={x.meta} k={k} />)}
            </div>
          </section>
        )}

        {brokers.length > 0 && (
          <section data-io className={s.group} aria-labelledby="team-brokers">
            <h3 id="team-brokers" className={s.gh}><Icon role="broker" size={15} />{tr('Брокерууд', 'Brokers', '经纪人团队')}<em>{brokers.length}</em></h3>
            <div className={s.grid}>
              {brokers.map((x, k) => <Card key={x.m.name} m={x.m} meta={x.meta} k={k} />)}
            </div>
          </section>
        )}
    </div>
  );
}
