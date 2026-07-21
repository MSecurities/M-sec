"use client";
import { useDarkMode } from "../../context/DarkModeContext";

export default function WeeklyPage() {
  const { isDarkMode } = useDarkMode();
  // Detect locale from URL (en/mn)
  let locale = 'en';
  if (typeof window !== 'undefined') {
    const pathLocale = window.location.pathname.split('/')[1];
    if (['en', 'mn'].includes(pathLocale)) {
      locale = pathLocale;
    }
  }

  return (
    <div className={`min-h-screen py-8 px-4 flex flex-col items-center ${isDarkMode ? "bg-[#26282c]" : "bg-gray-50"} transition-colors duration-200`}>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {locale === 'mn' ? 'Долоо хоногийн судалгаа' : 'Weekly Research'}
      </h1>
      <div className="w-full max-w-3xl">
        <iframe
          src="/files/weekly%20toim%20011.pdf"
          width="100%"
          height="700px"
          className="border rounded-lg shadow"
          title="Weekly Research PDF"
        ></iframe>
      </div>
    </div>
  );
}
