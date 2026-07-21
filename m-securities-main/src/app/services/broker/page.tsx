'use client';
import { useLanguage } from '../../context/LanguageContext';

const BrokerService = () => {
  const { t } = useLanguage();

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto fade-in">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16 slide-up">
        {t('services.broker.title')}
      </h1>

      <div className="space-y-8 slide-up">
        <p className="text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out hover:translate-x-2">
          {t('services.broker.description')}
        </p>

        <div className="bg-white dark:bg-[#26282c] p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
            {t('services.broker.requiredDocs.title')}
          </h3>
          
          <div className="grid gap-6">
            {/* Citizen Requirements */}
            <div className="transition-all duration-300 ease-in-out hover:translate-x-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                {t('services.broker.requiredDocs.citizen.title')}
              </h4>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                {(t('services.broker.requiredDocs.citizen.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Legal Entity Requirements */}
            <div className="transition-all duration-300 ease-in-out hover:translate-x-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                {t('services.broker.requiredDocs.legalEntity.title')}
              </h4>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                {(t('services.broker.requiredDocs.legalEntity.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Foreign Citizen Requirements */}
            <div className="transition-all duration-300 ease-in-out hover:translate-x-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                {t('services.broker.requiredDocs.foreignCitizen.title')}
              </h4>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                {(t('services.broker.requiredDocs.foreignCitizen.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerService; 