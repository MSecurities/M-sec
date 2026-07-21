"use client";
import Link from "next/link";
import { useLanguage } from "./context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t("error.404.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("error.404.description")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg
                   hover:bg-teal-600 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("error.404.backToHome")}
        </Link>
      </div>
    </div>
  );
}
