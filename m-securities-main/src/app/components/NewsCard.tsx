import Image from "next/image";

interface NewsCardProps {
  title: string;
  date: string;
  description: string;
  category: string;
  image: string;
  slug?: string;
}

const NewsCard = ({
  title,
  date,
  description,
  category,
  image,
  slug,
}: NewsCardProps) => {
  return (
    <div className="bg-white dark:bg-[#26282c] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-teal-500 font-semibold">
            {category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {date}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
        <a
          href={
            slug?.startsWith("http") || slug?.startsWith("www")
              ? slug
              : `/research/news/${slug || "#"}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors duration-200"
        >
          Read more
          <svg
            className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
