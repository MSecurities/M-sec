'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';

const Team = () => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});

  const getImagePath = (path: string) => {
    if (typeof window !== 'undefined') {
      return window.location.origin + path;
    }
    return path;
  };

  const teamMembers = [
    {
      name: t('about.team.members.member1.name'),
      position: t('about.team.members.member1.position'),
      image: getImagePath('/images/team/member1.jpg'),
      initials: 'ХМ'
    },
    {
      name: t('about.team.members.member2.name'),
      position: t('about.team.members.member2.position'),
      image: getImagePath('/images/team/member2.jpg'),
      initials: 'БМ'
    },
    {
      name: t('about.team.members.member3.name'),
      position: t('about.team.members.member3.position'),
      image: getImagePath('/images/team/member3.jpg'),
      initials: 'БН'
    },
    {
      name: t('about.team.members.member4.name'),
      position: t('about.team.members.member4.position'),
      image: getImagePath('/images/team/member4.jpg'),
      initials: 'МН'
    },
    {
      name: t('about.team.members.member5.name'),
      position: t('about.team.members.member5.position'),
      image: getImagePath('/images/team/member5.jpg'),
      initials: 'БА'
    },
    {
      name: t('about.team.members.member6.name'),
      position: t('about.team.members.member6.position'),
      image: getImagePath('/images/team/member6.jpg'),
      initials: 'БТ'
    },
  ];

  const handleImageError = (index: number) => {
    console.error(`Image failed to load for ${teamMembers[index].name} at path ${teamMembers[index].image}`);
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto fade-in">
      <h1 className="text-4xl font-bold text-teal-500 text-center mb-16 slide-up">
        {t('about.team.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 slide-up">
        {teamMembers.map((member, index) => (
          <div 
            key={index}
            className="flex flex-col items-center text-center space-y-4
                     transition-all duration-300 group"
          >
            {/* Circular Image Container */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden
                          border-4 border-teal-500 shadow-lg
                          transition-transform duration-300 group-hover:scale-105">
              {!imageError[index] ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl text-gray-400 dark:text-gray-500">
                    {member.initials}
                  </span>
                </div>
              )}
            </div>
            
            {/* Text Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {member.name}
              </h3>
              <p className="text-teal-600 dark:text-teal-400">
                {member.position}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team; 