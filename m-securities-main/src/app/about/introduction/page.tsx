'use client';
import { useLanguage } from '../../context/LanguageContext';

const Introduction = () => {
  const { t } = useLanguage();

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto fade-in">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16 slide-up">
        {t('about.introduction.title')}
      </h1>

      <div className="slide-up">
        <div className="bg-white dark:bg-[#26282c] rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {t('about.introduction.organizationalHistory.title')}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed transition-all duration-300 ease-in-out hover:translate-x-2">
              {t('about.introduction.organizationalHistory.description1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed transition-all duration-300 ease-in-out hover:translate-x-2">
              {t('about.introduction.organizationalHistory.description2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction; 