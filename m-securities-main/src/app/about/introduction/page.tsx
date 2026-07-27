'use client';
import { useLanguage } from '../../context/LanguageContext';

const getInitials = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const Introduction = () => {
  const { t } = useLanguage();

  const boardMembers = [
    {
      name: t('about.introduction.board.chairman.name'),
      position: t('about.introduction.board.chairman.position'),
    },
    {
      name: t('about.introduction.board.member1.name'),
      position: t('about.introduction.board.member1.position'),
    },
    {
      name: t('about.introduction.board.member2.name'),
      position: t('about.introduction.board.member2.position'),
    },
  ];

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

      <div className="slide-up mt-10">
        <div className="bg-white dark:bg-[#26282c] rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
            {t('about.introduction.board.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-teal-500/30">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(member.name)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {member.name}
                </h3>
                <p className="text-teal-600 dark:text-teal-400 mt-1">
                  {member.position}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
