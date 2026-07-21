'use client';

const MiningBrokerService = () => {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto fade-in">

      {/* HERO */}
      <div className="text-center mb-16">
        <span className="inline-block bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
          Уул уурхайн брокер · МХБ-ийн зөвшөөрөлтэй
        </span>
        <h1 className="text-4xl font-bold text-teal-500 mb-6">
          Уул уурхайн бүтээгдэхүүний цахим арилжаа
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          М Секьюритис ҮЦК нь СЗХ-оос тусгай зөвшөөрөл авсан, Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний арилжааг мэргэжлийн түвшинд хэрэгжүүлдэг брокер компани.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#contact" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Брокертой холбогдох ↗
          </a>
          <a href="#fees" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-teal-500 px-6 py-3 rounded-lg font-medium transition-colors">
            Шимтгэлийн мэдээлэл
          </a>
        </div>
      </div>

      {/* ДАВУУ ТАЛ */}
      <div className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-2">Бидний давуу тал</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Яагаад М Секьюритис?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '💰', title: 'Хамгийн бага шимтгэл', desc: 'Зах зээл дээрх хамгийн өрсөлдөхүйц шимтгэлийн хувь хэмжээ.' },
            { icon: '💻', title: 'Цогц програм хангамж', desc: 'Өөрсдийн хөгжүүлсэн арилжааны платформ — хурдан, найдвартай.' },
            { icon: '🏦', title: 'Банкны хамтын ажиллагаа', desc: 'Аккредитив болон бусад төлбөрийн шийдлийг банктай хамтран гүйцэтгэнэ.' },
            { icon: '👥', title: 'Туршлагатай баг', desc: 'Арилжааны туршлагатай, ёс суртахуунтай мэргэжлийн хамт олон.' },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-[#26282c] rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ШИЛЖИЛТИЙН ҮЕ ШАТ */}
      <div className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-2">Арилжааны хөгжил</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Бүрэн биржийн арилжаанд шилжих замнал</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">2026 оны 10 дугаар сараас уул уурхайн арилжааг зөвхөн брокероор дамжуулж гүйцэтгэнэ.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {[
            { label: 'Өмнөх үе', date: '2021 он хүртэл', items: ['Бирж байхгүй', 'Шууд гүйлгээ', 'Үнэ ил тод бус'], active: false },
            { label: 'Шилжилтийн үе', date: '2022 — 2026.09.30', items: ['2 сонголт: МХБ эсвэл брокер', 'Хагас бирж төвтэй', 'Хууль эцэслэгдэж байна'], active: true },
            { label: 'Бүрэн шилжилт', date: '2026.10.01-ээс', items: ['Зөвхөн брокероор', 'Бүрэн бирж төвтэй', 'МХБ үргэлжлүүлнэ'], active: true },
          ].map((p) => (
            <div key={p.label} className={`p-6 ${p.active ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-white dark:bg-[#26282c]'} border-r border-gray-200 dark:border-gray-700 last:border-r-0`}>
              <span className={`text-xs font-semibold uppercase tracking-widest ${p.active ? 'text-teal-500' : 'text-gray-400'}`}>{p.label}</span>
              <p className={`font-semibold mt-1 mb-4 ${p.active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500'}`}>{p.date}</p>
              <ul className="space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          ⚠ 2026 оны 10 сараас заавал брокерийн дансаар дамжуулах шаардлагатай. Одоо бүртгүүлэхийг зөвлөж байна.
        </p>
      </div>

      {/* ШИМТГЭЛ */}
      <div id="fees" className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-2">Үнэ тариф</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Брокерийн шимтгэл</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-[#26282c] rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Оролцогч</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Шимтгэлийн төрөл</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Хэмжээ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Худалдагч</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Захиалга бүртгэлийн хураамж</td>
                <td className="px-6 py-4 text-sm font-semibold text-teal-600">Тохиролцооны үндсэн дээр</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Худалдан авагч</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Арилжааны дүнгийн хувь</td>
                <td className="px-6 py-4 text-sm font-semibold text-teal-600">Тохиролцооны үндсэн дээр</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Аль аль тал</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">МХБ-ийн биржийн хураамж</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">МХБ-ийн журмын дагуу</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">* Харилцагчтай харилцан тохиролцсоны үндсэн дээр шимтгэлийг тохируулах боломжтой.</p>
      </div>

      {/* ХУУЛИЙН ОРЧИН */}
      <div className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-2">Эрх зүйн орчин</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Холбогдох хууль, дүрэм</h2>
        <div className="space-y-4">
          {[
            { src: 'УИХ · 2022.12.23', title: 'Уул Уурхайн Бүтээгдэхүүний Биржийн тухай хууль', desc: 'Арилжааг шударга, нээлттэй зохион байгуулж, зах зээлийн бодит үнэ тогтох боломжийг бүрдүүлнэ.', href: 'https://legalinfo.mn/mn/detail?lawId=16532653439101' },
            { src: 'СЗХ · 2024.03.29 · Тогтоол №133', title: 'Брокерийн шимтгэлийн зохицуулалт', desc: 'Шимтгэлийг хэт өндрөөр тогтоох, ялгавартай байдлаас сэргийлж арилжааны шударга нөхцлийг хангана.', href: 'https://www.frc.mn' },
            { src: 'МХБ · Арилжааны журам', title: 'Уул Уурхайн Бүтээгдэхүүний арилжааны журам', desc: 'Захиалга бүртгэх, арилжаа зохион байгуулах, мэдээллийн ил тод байдлыг хангахтай холбоотой харилцаа.', href: 'https://mse.mn/mn/content/list/253' },
          ].map((l) => (
            <a key={l.title} href={l.href} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-[#26282c] rounded-lg shadow p-5 hover:shadow-md transition-shadow">
              <span className="text-xs text-teal-500 font-semibold uppercase tracking-wide">{l.src}</span>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mt-1 mb-1">{l.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{l.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* ХОЛБОО БАРИХ */}
      <div id="contact">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-2">Холбоо барих</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Брокертой холбогдох</h2>
        <div className="bg-white dark:bg-[#26282c] rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-4">М Секьюритис ҮЦК</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📍 Нью Хориязонс Оффис 401, Улаанбаатар</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📞 +976-72270008</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">✉️ info@msecurities.mn</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">🕐 Даваа–Баасан · 09:00–18:00</p>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 text-sm text-teal-800 dark:text-teal-200">
                <strong>Анхаар:</strong> 2026 оны 10 сараас уул уурхайн арилжаанд оролцохдоо заавал брокерийн дансаар дамжуулах шаардлагатай.
              </div>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Бүтэн нэр" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-teal-500" />
              <input type="email" placeholder="Имэйл хаяг" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-teal-500" />
              <input type="tel" placeholder="Утасны дугаар" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-teal-500" />
              <input type="text" placeholder="Компанийн нэр" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-teal-500" />
              <textarea rows={3} placeholder="Санал, хүсэлт" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-teal-500 resize-none" />
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                Хүсэлт илгээх ↗
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MiningBrokerService;
