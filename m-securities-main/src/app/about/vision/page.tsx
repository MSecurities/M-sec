'use client';
import { useLanguage } from '../../context/LanguageContext';
import { EyeIcon } from '@heroicons/react/24/outline';

const Vision = () => {
  const { t } = useLanguage();

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto fade-in">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16 slide-up">
        {t('about.vision.title')}
      </h1>

      <div className="slide-up">
        <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#26282c] shadow-lg p-10 md:p-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          {/* Gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-400/5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-500/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />

          <div className="relative flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <EyeIcon className="w-10 h-10 text-white" />
            </div>

            <p className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed max-w-2xl">
              &ldquo;{t('about.vision.description')}&rdquo;
            </p>

            <div className="mt-8 w-16 h-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vision; 
