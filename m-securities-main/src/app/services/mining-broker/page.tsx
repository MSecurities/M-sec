'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';

const MiningBrokerService = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const bg = isDarkMode ? 'bg-[#080a0d]' : 'bg-[#f8f9fb]';
  const cardBg = isDarkMode ? 'bg-[#111318]' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-white/6' : 'border-gray-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const sectionAlt = isDarkMode ? 'bg-[#0d0f14]' : 'bg-white';

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${bg}`}>

      {/* ── HERO ── */}
      <section className={`relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden px-6 ${bg}`}>
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] opacity-10 ${isDarkMode ? 'bg-teal-400' : 'bg-teal-300'}`} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-10 border
            ${isDarkMode ? 'bg-white/4 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-500 shadow-sm'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            {language === 'mn' ? 'Уул уурхайн брокер · МХБ-ийн зөвшөөрөлтэй' : language === 'zh' ? '矿业经纪 · 持牌运营' : 'Mining Broker · MSE Licensed'}
          </div>

          {/* Title */}
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6 ${textPrimary}`}>
            {language === 'mn' ? (
              <>Уул уурхайн<br /><span className="text-teal-400">цахим арилжаа</span></>
            ) : language === 'zh' ? (
              <>矿产品<br /><span className="text-teal-400">在线交易</span></>
            ) : (
              <>Mining Products<br /><span className="text-teal-400">Online Trading</span></>
            )}
          </h1>

          <p className={`text-lg sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto ${textSecondary}`}>
            {language === 'mn'
              ? 'М Секьюритис ҮЦК нь СЗХ-оос тусгай зөвшөөрөл авсан, Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний арилжааг мэргэжлийн түвшинд хэрэгжүүлдэг брокер компани.'
              : language === 'zh'
              ? 'M Securities 持有金融监管委员会颁发的专项许可证，通过蒙古证券交易所专业开展矿产品交易。'
              : 'M Securities holds a special license from the FRC and professionally conducts mining product trading through the Mongolian Stock Exchange.'}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://mining.msecurities.mn/dashboard/app" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white
                bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
              {language === 'mn' ? 'Арилжаанд нэвтрэх' : language === 'zh' ? '进入交易平台' : 'Enter Trading Platform'} ↗
            </a>
            <a href="#contact"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border transition-all hover:-translate-y-0.5
                ${isDarkMode ? 'bg-white/6 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-800 border-gray-200 shadow-sm hover:border-teal-300'}`}>
              {language === 'mn' ? 'Брокертой холбогдох' : language === 'zh' ? '联系经纪人' : 'Contact Broker'}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className={`w-px h-10 bg-gradient-to-b from-transparent ${isDarkMode ? 'to-white/20' : 'to-gray-300'}`} />
          <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
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
            {[
              { icon: '💰', title: language === 'mn' ? 'Хамгийн бага шимтгэл' : language === 'zh' ? '最低手续费' : 'Lowest Fees', desc: language === 'mn' ? 'Зах зээл дээрх хамгийн өрсөлдөхүйц шимтгэлийн хувь хэмжээ.' : language === 'zh' ? '市场上最具竞争力的费率。' : 'Most competitive fee rates in the market.' },
              { icon: '💻', title: language === 'mn' ? 'Цогц платформ' : language === 'zh' ? '综合平台' : 'Comprehensive Platform', desc: language === 'mn' ? 'Өөрсдийн хөгжүүлсэн арилжааны платформ — хурдан, найдвартай.' : language === 'zh' ? '自主研发的交易平台，快速可靠。' : 'In-house developed trading platform — fast and reliable.' },
              { icon: '🏦', title: language === 'mn' ? 'Банкны хамтын ажиллагаа' : language === 'zh' ? '银行合作' : 'Bank Partnership', desc: language === 'mn' ? 'Аккредитив болон бусад төлбөрийн шийдлийг банктай хамтран гүйцэтгэнэ.' : language === 'zh' ? '与银行合作提供信用证及其他支付解决方案。' : 'Letter of credit and other payment solutions with banking partners.' },
              { icon: '👥', title: language === 'mn' ? 'Туршлагатай баг' : language === 'zh' ? '专业团队' : 'Expert Team', desc: language === 'mn' ? 'Арилжааны туршлагатай, ёс суртахуунтай мэргэжлийн хамт олон.' : language === 'zh' ? '经验丰富、职业道德高尚的专业团队。' : 'Experienced and ethical professional team.' },
            ].map(f => (
              <div key={f.title} className={`rounded-2xl border p-6 transition-all hover:-translate-y-1 ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-md'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${isDarkMode ? 'bg-white/4' : 'bg-gray-50'}`}>{f.icon}</div>
                <h3 className={`font-semibold mb-2 ${textPrimary}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${textSecondary}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ШИЛЖИЛТИЙН ҮЕ ШАТ ── */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Арилжааны хөгжил' : language === 'zh' ? '交易发展' : 'Trading Development'}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${textPrimary}`}>
              {language === 'mn' ? 'Бүрэн биржийн арилжаанд шилжих замнал' : language === 'zh' ? '全面转向交易所交易的路线图' : 'Roadmap to Full Exchange Trading'}
            </h2>
            <p className={`text-base max-w-xl mx-auto ${textSecondary}`}>
              {language === 'mn' ? '2026 оны 10 дугаар сараас уул уурхайн арилжааг зөвхөн брокероор дамжуулж гүйцэтгэнэ.' : language === 'zh' ? '2026年10月起，矿产品交易须通过经纪商进行。' : 'From October 2026, mining product trading must be conducted through brokers.'}
            </p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 rounded-2xl overflow-hidden border ${cardBorder}`}>
            {[
              { label: language === 'mn' ? 'Өмнөх үе' : language === 'zh' ? '历史阶段' : 'Previous Era', date: '2021 хүртэл', items: [language === 'mn' ? 'Бирж байхгүй' : 'No exchange', language === 'mn' ? 'Шууд гүйлгээ' : 'Direct transactions', language === 'mn' ? 'Үнэ ил тод бус' : 'Non-transparent pricing'], active: false },
              { label: language === 'mn' ? 'Шилжилтийн үе' : language === 'zh' ? '过渡期' : 'Transition', date: '2022 — 2026.09.30', items: [language === 'mn' ? 'МХБ эсвэл брокер — 2 сонголт' : '2 options: MSE or broker', language === 'mn' ? 'Хагас бирж төвтэй' : 'Semi-centralized', language === 'mn' ? 'Хууль эцэслэгдэж байна' : 'Regulations finalizing'], active: true },
              { label: language === 'mn' ? 'Бүрэн шилжилт' : language === 'zh' ? '全面转型' : 'Full Transition', date: '2026.10.01-ээс', items: [language === 'mn' ? 'Зөвхөн брокероор' : 'Broker only', language === 'mn' ? 'Бүрэн бирж төвтэй' : 'Fully centralized', language === 'mn' ? 'МХБ үргэлжлүүлнэ' : 'MSE continues'], active: true },
            ].map((p, i) => (
              <div key={i} className={`p-7 border-r last:border-r-0 ${cardBorder}
                ${p.active ? isDarkMode ? 'bg-teal-500/5' : 'bg-teal-50/50' : isDarkMode ? 'bg-[#111318]' : 'bg-white'}`}>
                <span className={`text-xs font-semibold uppercase tracking-widest ${p.active ? 'text-teal-400' : textSecondary}`}>{p.label}</span>
                <p className={`font-semibold mt-1 mb-5 text-sm ${p.active ? 'text-teal-400' : textSecondary}`}>{p.date}</p>
                <ul className="space-y-2.5">
                  {p.items.map((item, j) => (
                    <li key={j} className={`text-sm flex items-start gap-2 ${textSecondary}`}>
                      <span className="text-teal-400 mt-0.5 flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-xl text-sm ${isDarkMode ? 'bg-white/3 text-gray-400 border border-white/5' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
            ⚠ {language === 'mn' ? '2026 оны 10 сараас заавал брокерийн дансаар дамжуулах шаардлагатай. Одоо бүртгүүлэхийг зөвлөж байна.' : language === 'zh' ? '2026年10月起必须通过经纪商账户进行交易，建议立即注册。' : 'From October 2026, trading must go through a broker account. Register now.'}
          </div>
        </div>
      </section>

      {/* ── ШИМТГЭЛ ── */}
      <section id="fees" className={`py-20 px-6 ${sectionAlt}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Үнэ тариф' : language === 'zh' ? '费率' : 'Pricing'}
            </p>
            <h2 className={`text-3xl font-bold ${textPrimary}`}>
              {language === 'mn' ? 'Брокерийн шимтгэл' : language === 'zh' ? '经纪手续费' : 'Broker Fees'}
            </h2>
          </div>
          <div className={`rounded-2xl overflow-hidden border ${cardBorder}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${cardBorder} ${isDarkMode ? 'bg-white/3' : 'bg-gray-50'}`}>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${textSecondary}`}>{language === 'mn' ? 'Оролцогч' : language === 'zh' ? '参与方' : 'Participant'}</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${textSecondary}`}>{language === 'mn' ? 'Шимтгэлийн төрөл' : language === 'zh' ? '费用类型' : 'Fee Type'}</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${textSecondary}`}>{language === 'mn' ? 'Хэмжээ' : language === 'zh' ? '金额' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${cardBorder}`}>
                <tr className={isDarkMode ? 'bg-[#111318]' : 'bg-white'}>
                  <td className={`px-6 py-4 ${textPrimary}`}>{language === 'mn' ? 'Худалдагч' : language === 'zh' ? '卖方' : 'Seller'}</td>
                  <td className={`px-6 py-4 ${textSecondary}`}>{language === 'mn' ? 'Захиалга бүртгэлийн хураамж' : language === 'zh' ? '委托登记费' : 'Order registration fee'}</td>
                  <td className="px-6 py-4 font-semibold text-teal-400">{language === 'mn' ? 'Тохиролцооны үндсэн дээр' : language === 'zh' ? '协商确定' : 'By agreement'}</td>
                </tr>
                <tr className={isDarkMode ? 'bg-white/2' : 'bg-gray-50/50'}>
                  <td className={`px-6 py-4 ${textPrimary}`}>{language === 'mn' ? 'Худалдан авагч' : language === 'zh' ? '买方' : 'Buyer'}</td>
                  <td className={`px-6 py-4 ${textSecondary}`}>{language === 'mn' ? 'Арилжааны дүнгийн хувь' : language === 'zh' ? '交易金额百分比' : 'Percentage of trade value'}</td>
                  <td className="px-6 py-4 font-semibold text-teal-400">{language === 'mn' ? 'Тохиролцооны үндсэн дээр' : language === 'zh' ? '协商确定' : 'By agreement'}</td>
                </tr>
                <tr className={isDarkMode ? 'bg-[#111318]' : 'bg-white'}>
                  <td className={`px-6 py-4 ${textPrimary}`}>{language === 'mn' ? 'Аль аль тал' : language === 'zh' ? '双方' : 'Both parties'}</td>
                  <td className={`px-6 py-4 ${textSecondary}`}>{language === 'mn' ? 'МХБ-ийн биржийн хураамж' : language === 'zh' ? '交易所费用' : 'MSE exchange fee'}</td>
                  <td className={`px-6 py-4 ${textSecondary}`}>{language === 'mn' ? 'МХБ-ийн журмын дагуу' : language === 'zh' ? '按交易所规定' : 'Per MSE regulations'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`text-xs mt-3 ${textSecondary}`}>* {language === 'mn' ? 'Харилцагчтай харилцан тохиролцсоны үндсэн дээр шимтгэлийг тохируулах боломжтой.' : language === 'zh' ? '费率可与客户协商确定。' : 'Fees are negotiable with clients.'}</p>
        </div>
      </section>

      {/* ── ХУУЛИЙН ОРЧИН ── */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Эрх зүйн орчин' : language === 'zh' ? '法律环境' : 'Legal Framework'}
            </p>
            <h2 className={`text-3xl font-bold ${textPrimary}`}>
              {language === 'mn' ? 'Холбогдох хууль, дүрэм' : language === 'zh' ? '相关法律法规' : 'Relevant Laws & Regulations'}
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { src: 'УИХ · 2022.12.23', title: language === 'mn' ? 'Уул Уурхайн Бүтээгдэхүүний Биржийн тухай хууль' : language === 'zh' ? '矿产品交易所法' : 'Mining Products Exchange Law', desc: language === 'mn' ? 'Арилжааг шударга, нээлттэй зохион байгуулж, зах зээлийн бодит үнэ тогтох боломжийг бүрдүүлнэ.' : language === 'zh' ? '以公平、透明的方式组织交易，确保市场价格真实形成。' : 'Organize trading fairly and transparently, enabling real market price formation.', href: 'https://legalinfo.mn/mn/detail?lawId=16532653439101' },
              { src: 'СЗХ · 2024.03.29 · Тогтоол №133', title: language === 'mn' ? 'Брокерийн шимтгэлийн зохицуулалт' : language === 'zh' ? '经纪手续费监管规定' : 'Broker Fee Regulation', desc: language === 'mn' ? 'Шимтгэлийг хэт өндрөөр тогтоох, ялгавартай байдлаас сэргийлж арилжааны шударга нөхцлийг хангана.' : language === 'zh' ? '防止过高收费和差别对待，确保公平交易条件。' : 'Prevent excessive fees and discrimination, ensuring fair trading conditions.', href: 'https://www.frc.mn' },
              { src: 'МХБ · Арилжааны журам', title: language === 'mn' ? 'Уул Уурхайн Бүтээгдэхүүний арилжааны журам' : language === 'zh' ? '矿产品交易规则' : 'Mining Products Trading Rules', desc: language === 'mn' ? 'Захиалга бүртгэх, арилжаа зохион байгуулах, мэдээллийн ил тод байдлыг хангахтай холбоотой харилцаа.' : language === 'zh' ? '规范委托登记、交易组织及信息透明度相关事宜。' : 'Governs order registration, trade organization and information transparency.', href: 'https://mse.mn/mn/content/list/253' },
            ].map(l => (
              <a key={l.title} href={l.href} target="_blank" rel="noopener noreferrer"
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5
                  ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20 hover:bg-white/3' : 'hover:border-teal-200 hover:shadow-md'}`}>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wide">{l.src}</span>
                  <h4 className={`font-semibold mt-1 mb-1 ${textPrimary}`}>{l.title}</h4>
                  <p className={`text-sm ${textSecondary}`}>{l.desc}</p>
                </div>
                <span className={`text-lg flex-shrink-0 mt-1 ${textSecondary}`}>→</span>
              </a>
            ))}
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
                  {[
                    { icon: '📍', text: language === 'mn' ? 'Нью Хориязонс Оффис 401, Улаанбаатар' : language === 'zh' ? '新地平线办公室401，乌兰巴托' : 'New Horizons Office 401, Ulaanbaatar' },
                    { icon: '📞', text: '+976-72270008' },
                    { icon: '✉️', text: 'info@msecurities.mn' },
                    { icon: '🕐', text: language === 'mn' ? 'Даваа–Баасан · 09:00–18:00' : language === 'zh' ? '周一至周五 09:00–18:00' : 'Mon–Fri · 09:00–18:00' },
                  ].map(c => (
                    <div key={c.text} className="flex items-start gap-3">
                      <span className="text-base flex-shrink-0 mt-0.5">{c.icon}</span>
                      <span className={`text-sm ${textSecondary}`}>{c.text}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-6 p-4 rounded-xl text-sm ${isDarkMode ? 'bg-teal-500/8 text-teal-300 border border-teal-500/15' : 'bg-teal-50 text-teal-700 border border-teal-100'}`}>
                  <strong>{language === 'mn' ? 'Анхаар:' : language === 'zh' ? '注意：' : 'Note:'}</strong>{' '}
                  {language === 'mn' ? '2026 оны 10 сараас уул уурхайн арилжаанд оролцохдоо заавал брокерийн дансаар дамжуулах шаардлагатай.' : language === 'zh' ? '2026年10月起，参与矿产品交易须通过经纪商账户进行。' : 'From October 2026, mining product trading must go through a broker account.'}
                </div>
                <a href="https://mining.msecurities.mn/dashboard/app" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white mt-6
                    bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
                  {language === 'mn' ? 'Арилжааны платформ руу орох' : language === 'zh' ? '进入交易平台' : 'Enter Trading Platform'} ↗
                </a>
              </div>
              <form className="space-y-3">
                <input type="text" placeholder={language === 'mn' ? 'Бүтэн нэр' : language === 'zh' ? '全名' : 'Full Name'}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                    ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                <input type="email" placeholder={language === 'mn' ? 'Имэйл хаяг' : language === 'zh' ? '电子邮件' : 'Email Address'}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                    ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                <input type="tel" placeholder={language === 'mn' ? 'Утасны дугаар' : language === 'zh' ? '电话号码' : 'Phone Number'}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                    ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                <input type="text" placeholder={language === 'mn' ? 'Компанийн нэр' : language === 'zh' ? '公司名称' : 'Company Name'}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
                    ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                <textarea rows={3} placeholder={language === 'mn' ? 'Санал, хүсэлт' : language === 'zh' ? '留言' : 'Message'}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none
                    ${isDarkMode ? 'bg-white/4 border-white/8 text-white placeholder-gray-600 focus:border-teal-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400'}`} />
                <button type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white
                    bg-teal-500 hover:bg-teal-400 transition-all">
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

export default MiningBrokerService;
