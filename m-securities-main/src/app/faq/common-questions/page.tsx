'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  questions: FAQItem[];
}

interface FAQData {
  title: string;
  questions: FAQItem[];
  trading: FAQSection;
  account: FAQSection;
}

const CommonQuestions = () => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Get the FAQ data and ensure it's properly typed
  const faqData = t('faq.commonQuestions') as unknown as FAQData;
  const generalQuestions = Array.isArray(faqData.questions) ? faqData.questions : [];
  const tradingQuestions = Array.isArray(faqData.trading?.questions) ? faqData.trading.questions : [];
  const accountQuestions = Array.isArray(faqData.account?.questions) ? faqData.account.questions : [];

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto fade-in">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16 slide-up">
        {faqData.title}
      </h1>

      <div className="space-y-8 slide-up">
        {/* General Questions */}
        <div className="bg-white dark:bg-[#26282c] p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <div className="space-y-4">
            {generalQuestions.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => toggleSection(`general-${index}`)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                    {item.question}
                  </h3>
                  <span className="text-teal-500">
                    {openSections[`general-${index}`] ? '−' : '+'}
                  </span>
                </button>
                {openSections[`general-${index}`] && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trading Questions */}
        <div className="bg-white dark:bg-[#26282c] p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {faqData.trading?.title}
          </h2>
          <div className="space-y-4">
            {tradingQuestions.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => toggleSection(`trading-${index}`)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                    {item.question}
                  </h3>
                  <span className="text-teal-500">
                    {openSections[`trading-${index}`] ? '−' : '+'}
                  </span>
                </button>
                {openSections[`trading-${index}`] && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Questions */}
        <div className="bg-white dark:bg-[#26282c] p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {faqData.account?.title}
          </h2>
          <div className="space-y-4">
            {accountQuestions.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => toggleSection(`account-${index}`)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                    {item.question}
                  </h3>
                  <span className="text-teal-500">
                    {openSections[`account-${index}`] ? '−' : '+'}
                  </span>
                </button>
                {openSections[`account-${index}`] && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonQuestions; 