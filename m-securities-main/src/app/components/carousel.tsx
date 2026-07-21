'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

interface CarouselProps {
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [images.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  console.log('Image URLs:', images.map(img => img.url));

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Images */}
      <div className="relative h-full z-10">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              onError={(e) => {
                console.error('Image failed to load:', image.url);
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 z-30 transform -translate-y-1/2 bg-black/50 text-white 
                 p-3 rounded-full hover:bg-black/75 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 
                      ${index === currentIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'}`}
          />
        ))}
      </div>

      {/* Single Button at Bottom */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex items-center justify-center">
        <Link href="https://trader.msecurities.mn/">
          <button 
            className="bg-teal-500 text-white px-8 py-4 rounded-md text-lg font-semibold 
                     hover:bg-teal-600 transition duration-300 transform hover:scale-105
                     shadow-lg cursor-pointer"
          >
            {t('home.hero.startInvesting')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Carousel; 