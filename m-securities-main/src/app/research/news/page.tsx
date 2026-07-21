'use client';
import { useLanguage } from '../../context/LanguageContext';
import NewsCard from '../../components/NewsCard';

const News = () => {
  const { t } = useLanguage();

  // Mock data for latest news
  const latestNews = [
    {
      title: "Хиймэл оюун ухаан үнэт цаасны зах зээлийн ирээдүйг тодорхойлж байна",
      date: "2024-01-17",
      description: "2025 онд хиймэл оюун ухаан (AI) үнэт цаасны салбарт томоохон дэвшил авчирч, хөрөнгө оруулагчдын шийдвэр гаргалт, эрсдэлийн удирдлагыг шинэ түвшинд хүргэж байна. 2025 оны тренд болсон AI технологийн гол өөрчлөлтүүд",
      category: "Мэдээллийн Технологи",
      image: "https://picsum.photos/800/400?random=1",
      slug: "https://www.facebook.com/permalink.php?story_fbid=pfbid0ULam49xEjdWKommvmGaVjcxQCDpCRyxU8zRTfMCswokHEVcrPvGkkosi2PCvMtb9l&id=61570245532774"
    },
    {
      title: "ТикТокыг АНУ-д хориглох эсэх асуудал эгзэгтэй шатанд хүрч байна.",
      date: "2024-01-28",
      description: "АНУ-ын Дээд шүүх саяхан TikTok-ийг Хятадын эзэмшлийн ByteDance компанийн мэдэлд байгааг хүлээн зөвшөөрч, АНУ-ын үйл ажиллагааг нь хориглох эсвэл тус компанитай холбоог таслахыг шаардаж буй хуулийг баталсан. Энэхүү шийдвэр нь хууль эрх зүй, улс төр, болон корпорацын гэх мэт олон асуудлыг хөндөж байна.",
      category: "Сонин Хачин",
      image: "https://picsum.photos/800/400?random=2",
      slug: "https://www.facebook.com/permalink.php?story_fbid=pfbid0rmbvQY7NQKH5qdEnn3pm83DAGEc4VD12UcQkhMg2oTBt6dwS6YeEZ8BLHnxQqx5zl&id=61570245532774"
    },
    {
      title: "Үнэт цаасны зах зээлд холбогдох шүүхийн шийдвэрүүд",
      date: "2024-02-03",
      description: "Хууль бус хувьцааны арилжааг шүүхээс хүчингүйд тооцуулсан тохиолдолд хувьцаа эзэмшигчийн эрхээ нөхөн эдлэх боломжтой. Иргэн Э нь шүүхэд гаргасан нэхэмжлэлдээ хууль бус арилжааг хүчингүйд тооцуулах, хувьцааны өмчлөх эрхийг сэргээлгэх, хууль бусаар хувьцаа бусдад шилжсэн хугацааны ногдол ашгийг гаргуулах шаардлагыг тус тус гаргажээ. Компанийн ногдол ашиг нь хувьцаа эзэмшигчийн эдлэх эдийн засгийн үндсэн эрхүүдийн нэг билээ.",
      category: "Хууль",
      image: "https://picsum.photos/800/400?random=3",
      slug: "https://www.facebook.com/permalink.php?story_fbid=pfbid02AApALdFoJniW1ZpUf9DBxjiTUKrmNNn6adRa7SW7A5htSwkgFJVzwCCns78FSe6Dl&id=61570245532774"
    },
    {
      title: "Монгол улсын эдийн засгийн тойм",
      date: "2024-01-09",
      description: "Монгол улсын эдийн засгийн тоймийг хагас жил тутамд дэлийн банкнаас  шинжилгээ хийж танилцуулдаг. Монгол улсын дотоодын нийт бүтээгдэхүүний өсөлт 2024 онд 5.3 хувь байсан бол 2025 онд дэлхийн банк 6.5 хувиар өснө хэмээн таамаглаж байна.",
      category: "Санхүү",
      image: "https://picsum.photos/800/400?random=4",
      slug: "https://www.facebook.com/permalink.php?story_fbid=pfbid0gcJgEBCam5xrNPZWKY5DcUKwH5xgq4XS5jp1suA1n8RssCGpuX5nsi8gUMdKCrWTl&id=61570245532774"
    }
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-teal-500 mb-6 slide-up">
          {t('research.news.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 slide-up">
        {latestNews.map((news, index) => (
          <NewsCard
            key={index}
            title={news.title}
            date={news.date}
            description={news.description}
            category={news.category}
            image={news.image}
            slug={news.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default News; 