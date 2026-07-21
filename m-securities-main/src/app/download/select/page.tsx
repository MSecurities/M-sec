'use client';
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../../context/LanguageContext'

const AppleLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-20 h-20 text-gray-800 dark:text-white transition-all duration-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:scale-110"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

export default function SelectDownloadPage() {
  const { t } = useLanguage();
  const iosUrl = 'https://apps.apple.com/mn/app/m-securities-mn/id6745858855'
  const androidUrl = 'https://play.google.com/store/apps/details?id=com.istock.msec&hl=en'

  return (
    <div className="bg-gray-50 dark:bg-[#26282c] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {t('download.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t('download.description')}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* iOS Download Card */}
          <Link
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block p-8 bg-white dark:bg-[#23262b] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-teal-50 dark:hover:bg-[#17423b]"
          >
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <AppleLogo />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                {t('download.iosApp')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t('download.iosDesc')}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors duration-300">
                  {t('download.iosBtn')}
                </span>
              </div>
            </div>
          </Link>

          {/* Android Download Card */}
          <Link
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block p-8 bg-white dark:bg-[#23262b] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-teal-50 dark:hover:bg-[#17423b]"
          >
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Image
                  src="/images/google-play-2022.svg.png"
                  alt="Google Play"
                  width={80}
                  height={80}
                  className="transition-all duration-300 group-hover:scale-110"
                  draggable={false}
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                {t('download.androidApp')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t('download.androidDesc')}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors duration-300">
                  {t('download.androidBtn')}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 