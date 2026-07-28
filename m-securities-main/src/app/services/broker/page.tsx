'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import {
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  UserIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const BrokerService = () => {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const bg = isDarkMode ? 'bg-[#080a0d]' : 'bg-gradient-to-b from-teal-50/60 via-white to-teal-50/30';
  const cardBg = isDarkMode ? 'bg-[#111318]' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-white/6' : 'border-gray-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const sectionAlt = isDarkMode ? 'bg-[#0d0f14]' : 'bg-white';
  const iconBg = isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50';

  const advantages = [
    { Icon: ChartBarIcon, title: language === 'mn' ? 'МХБ-ийн бүрэн хамрах хүрээ' : language === 'zh' ? '全面覆盖交易所' : 'Full MSE Coverage', desc: language === 'mn' ? 'Монголын Хөрөнгийн Биржид бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа.' : language === 'zh' ? '交易蒙古证券交易所上市的股票、债券及其他证券。' : 'Trade stocks, bonds, and other securities listed on the Mongolian Stock Exchange.' },
    { Icon: UsersIcon, title: language === 'mn' ? 'Мэргэжлийн баг' : language === 'zh' ? '专业团队' : 'Expert Team', desc: language === 'mn' ? 'Санхүүгийн байдлын шинжилгээ, эрсдэлийн үнэлгээ хийж, тохирсон шийдэл санал болгоно.' : language === 'zh' ? '进行财务分析和风险评估，提供合适的方案。' : 'Financial analysis and risk assessment to recommend the right solution for you.' },
    { Icon: ShieldCheckIcon, title: language === 'mn' ? 'Найдвартай, зохицуулалттай' : language === 'zh' ? '安全合规' : 'Safe & Regulated', desc: language === 'mn' ? 'СЗХ-ны хяналт дор, олон улсын стандартад нийцсэн брокерын үйлчилгээ.' : language === 'zh' ? '在金融监管委员会监管下，符合国际标准的经纪服务。' : 'Brokerage services under FRC supervision, aligned with international standards.' },
    { Icon: DevicePhoneMobileIcon, title: language === 'mn' ? 'Хялбар онлайн үйлчилгээ' : language === 'zh' ? '便捷线上服务' : 'Easy Online Access', desc: language === 'mn' ? 'M Securities аппликейшнаар дансаа удирдаж, хаанаас ч арилжаанд оролцох боломжтой.' : language === 'zh' ? '通过M Securities应用随时随地管理账户并参与交易。' : 'Manage your account and trade from anywhere via the M Securities app.' },
  ];

  const docGroups = [
    { key: 'citizen', Icon: UserIcon },
    { key: 'legalEntity', Icon: BuildingOffice2Icon },
    { key: 'foreignCitizen', Icon: GlobeAltIcon },
  ] as const;

  const contactInfo = [
    { Icon: MapPinIcon, text: language === 'mn' ? 'Нью Хориязонс Оффис 401, Улаанбаатар' : language === 'zh' ? '新地平线办公室401，乌兰巴托' : 'New Horizons Office 401, Ulaanbaatar' },
    { Icon: PhoneIcon, text: '+976-72270008' },
    { Icon: EnvelopeIcon, text: 'info@msecurities.mn' },
    { Icon: ClockIcon, text: language === 'mn' ? 'Даваа–Баасан · 09:00–18:00' : language === 'zh' ? '周一至周五 09:00–18:00' : 'Mon–Fri · 09:00–18:00' },
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${bg}`}>

      {/* ── HERO ── */}
      <section className={`relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden px-6
        ${isDarkMode ? 'bg-[#080a0d]' : 'bg-gradient-to-br from-teal-50 via-white to-cyan-50'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px]
            ${isDarkMode ? 'opacity-10 bg-teal-400' : 'opacity-25 bg-teal-200'}`} />
          {!isDarkMode && <>
            <div className="absolute -top-20 -left-20 w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 bg-teal-300" />
            <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 bg-cyan-300" />
          </>}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-10 border
            ${isDarkMode ? 'bg-white/4 border-white/10 text-gray-300' : 'bg-white/80 border-teal-200 text-teal-700 shadow-sm'}`}>
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            {language === 'mn' ? 'Брокер · МХБ-ийн гишүүн' : language === 'zh' ? '经纪服务 · 交易所会员' : 'Broker · MSE Member'}
          </div>

          <h1 className={`text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6 ${textPrimary}`}>
            {t('services.broker.title')}
          </h1>

          <p className={`text-lg sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto ${textSecondary}`}>
            {t('services.broker.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://apps.apple.com/mn/app/id1455928972" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white
                bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
              {language === 'mn' ? 'Данс нээх' : language === 'zh' ? '开立账户' : 'Open Account'}
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </a>
            <a href="#contact"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border transition-all hover:-translate-y-0.5
                ${isDarkMode ? 'bg-white/6 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-800 border-gray-200 shadow-sm hover:border-teal-300'}`}>
              {language === 'mn' ? 'Брокертой холбогдох' : language === 'zh' ? '联系经纪人' : 'Contact Broker'}
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className={`w-px h-10 bg-gradient-to-b from-transparent ${isDarkMode ? 'to-white/20' : 'to-teal-300/40'}`} />
          <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? 'bg-white/20' : 'bg-teal-400/50'}`} />
        </div>
      </section>

      {/* ── ДАВУУ ТАЛ ── */}
      <section className={`py-20 px-6 ${sectionAlt}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Бидний давуу тал' : language === 'zh' ? '我们的优势' : 'Our Advantages'}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
              {language === 'mn' ? 'Яагаад М Секьюритис?' : language === 'zh' ? '为什么选择 M Securities?' : 'Why M Securities?'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map(f => (
              <div key={f.title} className={`rounded-2xl border p-6 transition-all hover:-translate-y-1
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-md'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                  <f.Icon className="w-5 h-5 text-teal-500" />
                </div>
                <h3 className={`font-semibold mb-2 ${textPrimary}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${textSecondary}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── БИЧИГ БАРИМТ ── */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Данс нээлгэх' : language === 'zh' ? '开户' : 'Open an Account'}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
              {t('services.broker.requiredDocs.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {docGroups.map(({ key, Icon }) => {
              const items = t(`services.broker.requiredDocs.${key}.items`) as unknown as string[];
              return (
                <div key={key} className={`rounded-2xl border p-7 transition-all hover:-translate-y-1
                  ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-lg'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}>
                    <Icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className={`font-semibold text-lg mb-4 ${textPrimary}`}>
                    {t(`services.broker.requiredDocs.${key}.title`)}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal-400" />
                        <span className={`text-sm leading-relaxed ${textSecondary}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ХОЛБОО БАРИХ ── */}
      <section id="contact" className={`py-20 px-6 ${sectionAlt}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Холбоо барих' : language === 'zh' ? '联系我们' : 'Contact'}
            </p>
            <h2 className={`text-3xl font-bold ${textPrimary}`}>
              {language === 'mn' ? 'Брокертой холбогдох' : language === 'zh' ? '联系经纪人' : 'Contact Our Broker'}
            </h2>
          </div>
          <div className={`rounded-3xl border p-8 sm:p-10 ${cardBg} ${cardBorder}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${textPrimary}`}>М Секьюритис ҮЦК</h3>
                <div className="space-y-4">
                  {contactInfo.map(c => (
                    <div key={c.text} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                        <c.Icon className="w-4 h-4 text-teal-500" />
                      </div>
                      <span className={`text-sm pt-1 ${textSecondary}`}>{c.text}</span>
                    </div>
                  ))}
                </div>
                <a href="https://apps.apple.com/mn/app/id1455928972" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white mt-6
                    bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
                  {language === 'mn' ? 'Данс нээх' : language === 'zh' ? '开立账户' : 'Open Account'}
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                </a>
              </div>
              <form className="space-y-3">
                {[
                  { type: 'text', placeholder: language === 'mn' ? 'Бүтэн нэр' : language === 'zh' ? '全名' : 'Full Name' },
                  { type: 'email', placeholder: language === 'mn' ? 'Имэйл хаяг' : language === 'zh' ? '电子邮件' : 'Email Address' },
                  { type: 'tel', placeholder: language === 'mn' ? 'Утасны дугаар' : language === 'zh' ? '电话号码' : 'Phone Number' },
                  { type: 'text', placeholder: language === 'mn' ? 'Компанийн нэр' : language === 'zh' ? '公司名称' : 'Company Name' },
                ].map(f => (
                  <input key={f.placeholder} type={f.type} placeholder={f.placeholder}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                      ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                ))}
                <textarea rows={3} placeholder={language === 'mn' ? 'Санал, хүсэлт' : language === 'zh' ? '留言' : 'Message'}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none
                    ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                <button type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all">
                  {language === 'mn' ? 'Хүсэлт илгээх' : language === 'zh' ? '提交申请' : 'Submit Request'} →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BrokerService;
