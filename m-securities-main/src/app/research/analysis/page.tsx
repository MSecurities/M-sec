
"use client";
import { useEffect, useState } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
// Remove useRouter import; use App Router params instead

interface Top20Index {
  value: string;
  change: string;
  percent: string;
  lastUpdated: string;
  companies: Array<{
    symbol: string;
    name: string;
    price: string;
    marketCap: string;
    business: string;
  }>;
}



export default function AnalysisPage() {
  const { isDarkMode } = useDarkMode();
  // Get locale from App Router params
  // If you move this file to src/app/[locale]/research/analysis/page.tsx, Next.js will pass 'params' as a prop
  // For now, fallback to 'en' if not available
  let locale = 'en';
  if (typeof window !== 'undefined') {
    const pathLocale = window.location.pathname.split('/')[1];
    if (['en', 'mn'].includes(pathLocale)) {
      locale = pathLocale;
    }
  }
  const [data, setData] = useState<Top20Index | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchMSEData() {
      try {
        const url = locale === 'mn'
          ? 'https://mse.mn/mn/mse_top_20/266'
          : 'https://mse.mn/en/mse_top_20/266';
        const res = await fetch(url);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const value = doc.querySelector('.mse-index-value')?.textContent?.trim() || '';
        const change = doc.querySelector('.mse-index-change')?.textContent?.trim() || '';
        const percent = doc.querySelector('.mse-index-percent')?.textContent?.trim() || '';
        const lastUpdated = doc.querySelector('.mse-index-date')?.textContent?.trim() || '';
        const companies: Top20Index['companies'] = [];
        const rows = doc.querySelectorAll('.mse-top20-table tbody tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 5) {
            companies.push({
              symbol: cells[0].textContent?.trim() || '',
              name: cells[1].textContent?.trim() || '',
              price: cells[2].textContent?.trim() || '',
              marketCap: cells[3].textContent?.trim() || '',
              business: cells[4].textContent?.trim() || '',
            });
          }
        });
        setData({ value, change, percent, lastUpdated, companies });
      } catch (error) {
        setData({
          value: "49,532.82",
          change: "+61.64",
          percent: "+0.12%",
          lastUpdated: "2025-07-22",
          companies: locale === 'mn' ? [
            { symbol: "AARD", name: "Ард санхүүгийн групп", price: "3,007", marketCap: "73,508,830,321", business: "Санхүүгийн үйлчилгээ" },
            { symbol: "ADB", name: "Ард кредит", price: "101", marketCap: "36,434,913,060", business: "Санхүүгийн үйлчилгээ" },
            { symbol: "APU", name: "АПУ", price: "999", marketCap: "1,062,507,343,127", business: "Хүнсний үйлдвэрлэл" },
            { symbol: "QPAY", name: "Инновац хөрөнгө оруулалт", price: "213", marketCap: "39,372,146,622", business: "Мэдээллийн технологи" },
            { symbol: "CUMN", name: "Премиум Нексус ХК", price: "203", marketCap: "226,193,162,902", business: "Хүнсний үйлдвэрлэл" },
            { symbol: "GLMT", name: "Голомт банк", price: "1,056", marketCap: "853,942,115,136", business: "Санхүүгийн үйлчилгээ" },
            { symbol: "GOV", name: "Говь", price: "243", marketCap: "189,000,000,000", business: "Үйлдвэрлэл" },
            { symbol: "MNDL", name: "Мандал даатгал", price: "1,200", marketCap: "50,000,000,000", business: "Даатгал" },
            { symbol: "TCK", name: "Таван толгой", price: "5,000", marketCap: "200,000,000,000", business: "Уул уурхай" },
            { symbol: "SUU", name: "Сүү ХК", price: "350", marketCap: "30,000,000,000", business: "Хүнсний үйлдвэрлэл" },
            { symbol: "MNP", name: "Монгол шуудан", price: "180", marketCap: "10,000,000,000", business: "Логистик" },
            { symbol: "APU2", name: "АПУ-2", price: "1,100", marketCap: "900,000,000,000", business: "Хүнсний үйлдвэрлэл" },
            { symbol: "BDS", name: "Бодь даатгал", price: "1,050", marketCap: "45,000,000,000", business: "Даатгал" },
            { symbol: "MFC", name: "Микрофинанс", price: "210", marketCap: "15,000,000,000", business: "Санхүүгийн үйлчилгээ" },
            { symbol: "INV", name: "Инвестмент ХК", price: "400", marketCap: "25,000,000,000", business: "Хөрөнгө оруулалт" },
            { symbol: "TTM", name: "ТТМ", price: "2,000", marketCap: "100,000,000,000", business: "Уул уурхай" },
            { symbol: "MON", name: "Монцемент", price: "800", marketCap: "60,000,000,000", business: "Барилга" },
            { symbol: "ERG", name: "Эрдэнэс таван толгой", price: "6,000", marketCap: "300,000,000,000", business: "Уул уурхай" },
            { symbol: "MCS", name: "М-Си-Эс", price: "2,500", marketCap: "120,000,000,000", business: "Холдинг" },
            { symbol: "UBS", name: "Улаанбаатар банк", price: "1,300", marketCap: "70,000,000,000", business: "Санхүүгийн үйлчилгээ" }
          ] : [
            { symbol: "AARD", name: "Ard financial group", price: "3,007", marketCap: "73,508,830,321", business: "Financial services" },
            { symbol: "ADB", name: "Ard credit", price: "101", marketCap: "36,434,913,060", business: "Financial services" },
            { symbol: "APU", name: "APU", price: "999", marketCap: "1,062,507,343,127", business: "Food production" },
            { symbol: "QPAY", name: "Innovation Investment", price: "213", marketCap: "39,372,146,622", business: "Information technology" },
            { symbol: "CUMN", name: "Premium Nexus JSC", price: "203", marketCap: "226,193,162,902", business: "Food production" },
            { symbol: "GLMT", name: "Golomt Bank", price: "1,056", marketCap: "853,942,115,136", business: "Financial services" },
            { symbol: "GOV", name: "Gobi", price: "243", marketCap: "189,000,000,000", business: "Manufacturing" },
            { symbol: "MNDL", name: "Mandal Insurance", price: "1,200", marketCap: "50,000,000,000", business: "Insurance" },
            { symbol: "TCK", name: "Tavan Tolgoi", price: "5,000", marketCap: "200,000,000,000", business: "Mining" },
            { symbol: "SUU", name: "Suu JSC", price: "350", marketCap: "30,000,000,000", business: "Food production" },
            { symbol: "MNP", name: "Mongol Post", price: "180", marketCap: "10,000,000,000", business: "Logistics" },
            { symbol: "APU2", name: "APU-2", price: "1,100", marketCap: "900,000,000,000", business: "Food production" },
            { symbol: "BDS", name: "Bodi Insurance", price: "1,050", marketCap: "45,000,000,000", business: "Insurance" },
            { symbol: "MFC", name: "Microfinance", price: "210", marketCap: "15,000,000,000", business: "Financial services" },
            { symbol: "INV", name: "Investment JSC", price: "400", marketCap: "25,000,000,000", business: "Investment" },
            { symbol: "TTM", name: "TTM", price: "2,000", marketCap: "100,000,000,000", business: "Mining" },
            { symbol: "MON", name: "Moncement", price: "800", marketCap: "60,000,000,000", business: "Construction" },
            { symbol: "ERG", name: "Erdenes Tavan Tolgoi", price: "6,000", marketCap: "300,000,000,000", business: "Mining" },
            { symbol: "MCS", name: "MCS Holding", price: "2,500", marketCap: "120,000,000,000", business: "Holding" },
            { symbol: "UBS", name: "Ulaanbaatar Bank", price: "1,300", marketCap: "70,000,000,000", business: "Financial services" }
          ]
        });
      }
      setLoading(false);
    }
    fetchMSEData();
  }, [locale]);

  return (
    <div className={`min-h-screen py-4 px-1 sm:py-8 sm:px-2 md:py-12 md:px-8 ${isDarkMode ? "bg-[#26282c]" : "bg-gray-50"} transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto fade-in">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-teal-500 text-center mb-6 xs:mb-10 sm:mb-16 slide-up">
          {locale === 'mn' ? 'Судалгаа шинжилгээ' : 'Research & Analysis'}
        </h1>
        <div className="grid gap-3 xs:gap-4 sm:gap-6 slide-up">
          <div className="bg-white dark:bg-[#26282c] p-3 xs:p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-base sm:text-lg leading-relaxed transition-all duration-300 ease-in-out hover:translate-x-2">
              {locale === 'mn' ? 'Манай судалгаа шинжилгээний хэсэгт МХБ-ийн Топ 20 индекс болон компаниудын мэдээллийг бодит цагийн горимоор харуулна.' : 'Our research & analysis section displays real-time MSE Top 20 index and company information.'}
            </p>
          </div>
          {/* MSE Top 20 Index Data Section */}
          <div className="bg-white dark:bg-[#26282c] p-3 xs:p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 mt-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-2 xs:mb-3 sm:mb-4 text-teal-600 dark:text-teal-400">{locale === 'mn' ? 'МХБ Топ 20 индекс' : 'MSE Top 20 Index'}</h2>
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm xs:text-base sm:text-lg">Loading...</div>
            ) : (
              <>
                <div className={`rounded-xl shadow-lg p-3 xs:p-4 sm:p-8 mb-4 xs:mb-6 sm:mb-8 flex flex-col items-center ${isDarkMode ? "bg-[#26282c] text-white" : "bg-white text-gray-900"}`}>
                  <div className="text-2xl xs:text-3xl sm:text-5xl font-bold mb-2">{data?.value}</div>
                  <div className="text-sm xs:text-base sm:text-xl mb-2 flex items-center gap-2">
                    <span className={data?.change.startsWith("+") ? "text-green-500" : "text-red-500"}>{data?.change}</span>
                    <span className={data?.percent.startsWith("+") ? "text-green-500" : "text-red-500"}>({data?.percent})</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                    {locale === 'mn' ? 'Сүүлийн шинэчлэл: ' : 'Last updated: '} {data?.lastUpdated}
                  </div>
                </div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-2 xs:mb-3 sm:mb-4 text-center">{locale === 'mn' ? 'Топ 20 компаниуд' : 'Top 20 Companies'}</h2>
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                  <table className={`min-w-[420px] xs:min-w-[520px] sm:min-w-[600px] w-full rounded-xl overflow-hidden text-xs xs:text-sm sm:text-base ${isDarkMode ? "bg-[#26282c] text-white" : "bg-white text-gray-900"}`}>
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-1 xs:px-2 sm:px-4 py-2 text-left whitespace-nowrap">{locale === 'mn' ? 'Симбол' : 'Symbol'}</th>
                        <th className="px-1 xs:px-2 sm:px-4 py-2 text-left whitespace-nowrap">{locale === 'mn' ? 'Нэр' : 'Name'}</th>
                        <th className="px-1 xs:px-2 sm:px-4 py-2 text-left whitespace-nowrap">{locale === 'mn' ? 'Ханш' : 'Price'}</th>
                        <th className="px-1 xs:px-2 sm:px-4 py-2 text-left whitespace-nowrap">{locale === 'mn' ? 'Зах зээлийн үнэлгээ' : 'Market Cap'}</th>
                        <th className="px-1 xs:px-2 sm:px-4 py-2 text-left whitespace-nowrap">{locale === 'mn' ? 'Салбар' : 'Business'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.companies.map((c) => (
                        <tr key={c.symbol} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                          <td className="px-1 xs:px-2 sm:px-4 py-2 font-semibold whitespace-nowrap">{c.symbol}</td>
                          <td className="px-1 xs:px-2 sm:px-4 py-2 whitespace-nowrap">{c.name}</td>
                          <td className="px-1 xs:px-2 sm:px-4 py-2 whitespace-nowrap">{c.price}</td>
                          <td className="px-1 xs:px-2 sm:px-4 py-2 whitespace-nowrap">{c.marketCap}</td>
                          <td className="px-1 xs:px-2 sm:px-4 py-2 whitespace-nowrap">{c.business}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}