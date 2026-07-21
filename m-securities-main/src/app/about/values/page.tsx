'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Values = () => {
  const { t } = useLanguage();
  const { ref: gridRef, inView: gridIsVisible } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const values = [
    {
      title: t('about.value.items.mastery.title'),
      color: "from-red-500 to-orange-500",
      description: t('about.value.items.mastery.description'),
      Icon: AcademicCapIcon
    },
    {
      title: t('about.value.items.teamSpirit.title'),
      color: "from-orange-500 to-yellow-500",
      description: t('about.value.items.teamSpirit.description'),
      Icon: UserGroupIcon
    },
    {
      title: t('about.value.items.leadership.title'),
      color: "from-yellow-500 to-green-500",
      description: t('about.value.items.leadership.description'),
      Icon: LightBulbIcon
    },
    {
      title: t('about.value.items.mcsSpirit.title'),
      color: "from-green-500 to-teal-500",
      description: t('about.value.items.mcsSpirit.description'),
      Icon: SparklesIcon
    },
    {
      title: t('about.value.items.creativity.title'),
      color: "from-teal-500 to-blue-500",
      description: t('about.value.items.creativity.description'),
      Icon: PuzzlePieceIcon
    },
    {
      title: t('about.value.items.integrity.title'),
      color: "from-blue-500 to-indigo-500",
      description: t('about.value.items.integrity.description'),
      Icon: ShieldCheckIcon
    },
    {
      title: t('about.value.items.sustainable.title'),
      color: "from-indigo-500 to-purple-500",
      description: t('about.value.items.sustainable.description'),
      Icon: GlobeAltIcon
    }
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16">
        {t('about.value.title')}
      </h1>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 
                     shadow-lg transition-all duration-300 hover:-translate-y-2"
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-5`} />
            
            {/* Content */}
            <div className="relative p-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 mb-6">
                <value.Icon className={`w-full h-full text-gray-600 dark:text-gray-300`} />
              </div>

              <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}>
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Values;