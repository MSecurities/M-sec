'use client';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { Band, Body, Btn, Cover, NextServices, Rows, Sec, ServicePage, s, useTr } from '../../components/services/kit';
import { ClockBoard } from '../../components/services/visuals';
import type { Market } from '../../components/services/visuals';

const APP_URL = 'https://apps.apple.com/mn/app/id1455928972';

const ForeignTradingPage = () => {
  const { t, tr, language } = useTr();

  const features = [
    { icon: <GlobeAltIcon />, title: tr('Дэлхийн тэргүүлэх биржүүд', 'Global Leading Exchanges', '全球领先交易所'), desc: tr('NYSE, NASDAQ, LSE болон бусад дэлхийн тэргүүлэх хөрөнгийн биржүүд дээр хөрөнгө оруулах боломж.', 'Access NYSE, NASDAQ, LSE and other leading global stock exchanges.', '可在NYSE、纳斯达克、伦交所等全球主要交易所投资。') },
    { icon: <ChartBarIcon />, title: tr('Хувьцаа, бонд, ETF', 'Stocks, Bonds, ETFs', '股票、债券、ETF'), desc: tr('Олон улсын хувьцаа, бонд, ETF болон бусад санхүүгийн хэрэглүүрт хөрөнгө оруулах боломж.', 'Invest in international stocks, bonds, ETFs and other financial instruments.', '可投资国际股票、债券、ETF及其他金融工具。') },
    { icon: <DevicePhoneMobileIcon />, title: tr('Аппликейшнаар арилжаа', 'Mobile App Trading', '手机APP交易'), desc: tr('М Банк апп-ийн "Хувьцаа" цэснээс хаанаас ч гадаад зах зээлд хялбараар нэвтрэх боломж.', 'Access foreign markets easily from anywhere via the "Stocks" menu of the M Bank app.', '通过M Bank应用的“股票”菜单随时随地轻松进入国际市场。') },
    { icon: <ShieldCheckIcon />, title: tr('Найдвартай, аюулгүй', 'Safe & Secure', '安全可靠'), desc: tr('СЗХ-ны хяналт дор мэргэжлийн брокерийн үйлчилгээ.', 'Professional brokerage service under FRC supervision.', '在金融监管委员会监管下提供专业经纪服务。') },
  ];

  const steps = [
    { title: tr('Данс нээх', 'Open Account', '开立账户'), desc: tr('М Банк апп Хувьцаа цэс рүү орж дансаа нээнэ.', 'Open your account in the Stocks menu of the M Bank app.', '进入M Bank应用的“股票”菜单开立账户。') },
    { title: tr('Мөнгө байршуулах', 'Fund Account', '存入资金'), desc: tr('Дансандаа мөнгө байршуулж гадаад арилжааны эрх нээнэ.', 'Deposit funds and activate foreign trading access.', '向账户存入资金并开通境外交易权限。') },
    { title: tr('Хөрөнгө оруулах', 'Start Investing', '开始投资'), desc: tr('Дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулж эхэлнэ.', 'Start investing in global capital markets.', '开始在全球资本市场投资。') },
  ];

  const markets: Market[] = [
    { name: 'NYSE', country: 'us', tz: 'America/New_York', desc: tr('Нью Йоркийн хөрөнгийн бирж', 'New York Stock Exchange', '纽约证券交易所') },
    { name: 'NASDAQ', country: 'us', tz: 'America/New_York', desc: tr('Технологийн тэргүүлэх бирж', 'Technology leading exchange', '科技领先交易所') },
    { name: 'LSE', country: 'gb', tz: 'Europe/London', desc: tr('Лондонгийн хөрөнгийн бирж', 'London Stock Exchange', '伦敦证券交易所') },
    { name: 'TSE', country: 'jp', tz: 'Asia/Tokyo', desc: tr('Токиогийн хөрөнгийн бирж', 'Tokyo Stock Exchange', '东京证券交易所') },
    { name: 'HKEX', country: 'hk', tz: 'Asia/Hong_Kong', desc: tr('Хонконгийн хөрөнгийн бирж', 'Hong Kong Stock Exchange', '香港交易所') },
    { name: 'SSE', country: 'cn', tz: 'Asia/Shanghai', desc: tr('Шанхайн хөрөнгийн бирж', 'Shanghai Stock Exchange', '上海证券交易所') },
  ];

  const start = <Btn href={APP_URL} external>{tr('Арилжаа эхлэх', 'Start Trading', '开始交易')}</Btn>;
  const app = <Btn href={APP_URL} external kind="g"><DevicePhoneMobileIcon width={18} height={18} />{tr('Апп татах', 'Download App', '下载应用')}</Btn>;

  return (
    <ServicePage>
      <Cover
        crumb={t('navbar.sections.foreignTrading')}
        badge={tr('Гадаад арилжаа · шинэ үйлчилгээ', 'Foreign Trading · New Service', '境外交易 · 全新服务')}
        title={language === 'mn' ? ['Дэлхийн хөрөнгийн', 'зах зээлд нэвтрэ'] : language === 'zh' ? ['进入全球', '资本市场'] : ['Enter Global', 'Capital Markets']}
        lead={tr('М Банк апп-ийн "Хувьцаа" цэсийг ашиглан хаанаас ч дэлхийн хөрөнгийн зах зээлд шууд нэвтэрч, дэлхийн тэргүүлэх биржүүд дээр хөрөнгө оруулах боломжтой боллоо.',
          "With the \"Stocks\" menu of the M Bank app, you can access global capital markets directly from anywhere and invest on the world's leading exchanges.",
          '通过M Bank应用的“股票”菜单，您可以随时随地直接进入全球资本市场，在全球领先交易所进行投资。')}
        actions={<>{start}{app}</>}
        display={
          <Image src="/images/foreign-trading-banner.png" fill priority sizes="(max-width: 1280px) 100vw, 1152px"
            alt={tr('Гадаад арилжаа нэвтэрлээ', 'Foreign Trading Launched', '境外交易上线')} />
        }
      />

      <Body toc={[
        { id: 'advantages', label: tr('Давуу тал', 'Advantages', '优势') },
        { id: 'markets', label: tr('Биржүүд', 'Exchanges', '交易所') },
        { id: 'steps', label: tr('Эхлэх алхмууд', 'How to Start', '开始步骤') },
      ]}>
        <Sec id="advantages" n={1} title={tr('Яагаад гадаад арилжаа?', 'Why Foreign Trading?', '为什么选择境外交易？')}>
          <Rows items={features} />
        </Sec>
        <Sec id="markets" n={2} title={tr('Дэлхийн тэргүүлэх биржүүд', "World's Leading Exchanges", '全球领先交易所')}>
          <ClockBoard markets={markets} ubLabel={tr('Улаанбаатарын цаг', 'Ulaanbaatar time', '乌兰巴托时间')} />
        </Sec>
        <Sec id="steps" n={3} title={tr('3 алхамаар эхэлнэ', 'Start in 3 Steps', '3步开始')}>
          <div className={s.steps}>
            {steps.map((st, i) => (
              <div key={i} className={`${s.step} ${s.rv}`} style={{ '--d': i } as CSSProperties}>
                <span className={s.pb} aria-hidden="true"><i></i></span>
                <span className={s.big} aria-hidden="true">{i + 1}</span>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
              </div>
            ))}
          </div>
        </Sec>
        <Band
          title={language === 'mn' ? ['Дэлхийгээс өгөөж', 'хүртэх гүүр'] : language === 'zh' ? ['连接全球', '收益的桥梁'] : ['Bridge to Global', 'Opportunity']}
          lead={tr('М Секьюритис ҮЦК-тай хамтран дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулаарай.', 'Invest in global capital markets with M Securities.', '与M Securities合作，在全球资本市场投资。')}
          actions={<>{start}{app}</>}
        />
      </Body>

      <NextServices current="foreign" />
    </ServicePage>
  );
};

export default ForeignTradingPage;
