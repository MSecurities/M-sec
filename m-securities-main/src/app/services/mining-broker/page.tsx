import { notFound } from 'next/navigation';

const TradingAnimation = () => (
  <div className="flex justify-center mb-8 animate-pulse">
    <span className="mx-2 text-4xl">📈</span>
    <span className="mx-2 text-4xl">💹</span>
    <span className="mx-2 text-4xl">📉</span>
    <span className="mx-2 text-4xl">💲</span>
    <span className="mx-2 text-4xl">🔄</span>
  </div>
);

export default function MiningBrokerService() {
  return (
    <div className="py-20 px-4 max-w-4xl mx-auto fade-in text-center">
      <TradingAnimation />
      <h1 className="text-4xl font-bold text-teal-500 mb-8">Coming Soon</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">This service page is under construction. Please check back later!</p>
    </div>
  );
} 