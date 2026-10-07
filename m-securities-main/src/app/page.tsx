// app/page.tsx
import Hero from "./components/hero/Hero";
import HomeSections from "./components/home/HomeSections";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HomeSections />
    </div>
  );
}
