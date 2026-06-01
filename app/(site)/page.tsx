import HeroSection from '@/components/home/HeroSection';
import PerksStrip from '@/components/home/PerksStrip';
import CategoryBanner from '@/components/home/CategoryBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PerksStrip />
      <CategoryBanner />
      <FeaturedProducts />
    </>
  );
}
