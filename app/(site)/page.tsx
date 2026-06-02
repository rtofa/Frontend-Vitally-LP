import HeroSection from '@/components/home/HeroSection';
import PerksStrip from '@/components/home/PerksStrip';
import ProductGridSection from '@/components/home/ProductGridSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PerksStrip />
      <ProductGridSection title="Lançamentos" subtitle="Novidades" categoryFilterName="Lançamentos" />
      <CategoryCarousel />
      <ProductGridSection title="Destaques" subtitle="Populares" categoryFilterName="Destaques" />
    </>
  );
}
