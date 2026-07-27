'use client';
import { useLanguage } from '../../context/LanguageContext';
import {
  GlobeAltIcon,
  CpuChipIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const goalIcons = [GlobeAltIcon, CpuChipIcon, ChartBarIcon, UserGroupIcon];

const Goal = () => {
  const { t } = useLanguage();
  const items = t('about.goal.items') as unknown as string[];

  return (
    <div className="py-20 px-4 max-w-6xl mx-auto fade-in">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16 slide-up">
        {t('about.goal.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 slide-up">
        {items.map((item: string, index: number) => {
          const Icon = goalIcons[index % goalIcons.length];
          return (
            <div
              key={index}
              className="group flex items-start gap-5 rounded-xl bg-white dark:bg-[#26282c] shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed pt-2">
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goal; 
