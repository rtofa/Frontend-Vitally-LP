'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners } from '@/lib/services/banners';
import type { Banner } from '@/lib/api-types';

type HeroSlide = {
  id: number | string;
  tag: string;
  sub: string;
  cta: string;
  href: string;
  desktopImage: string;
  mobileImage: string;
  accent: string;
};

const mapBannerToSlide = (banner: Banner, index: number): HeroSlide => ({
  id: banner.id ?? index,
  tag: banner.tag ?? '',
  sub: banner.subtitle ?? '',
  cta: banner.ctaText ?? '',
  href: banner.ctaLink ?? '',
  desktopImage: banner.desktopImageUrl || banner.image || '',
  mobileImage: banner.mobileImageUrl || banner.desktopImageUrl || banner.image || '',
  accent: banner.accent ?? 'from-[#39FF14]/20 via-transparent to-transparent',
});

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const banners = await getActiveBanners();
        if (!active) return;
        if (banners.length === 0) {
          setSlides([]);
          return;
        }
        setSlides(banners.map(mapBannerToSlide));
        setCurrent(0);
      } catch (error) {
        if (active) setError('Não foi possível carregar os banners do hero.');
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const go = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      go((current + 1) % slides.length);
    }, 6500);
    return () => clearInterval(t);
  }, [current, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/70" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6">
          <div className="space-y-3">
            <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.35em]">Vitally</div>
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black">Nenhum banner ativo ainda</h1>
            <p className="text-white/60 text-xs sm:text-sm">
              {error || 'Adicione um banner no painel admin para destacar novidades.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] overflow-hidden bg-black flex flex-col justify-center">
      <div
        className={`relative w-full h-full transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Background Image determining the height */}
        {(slide.desktopImage || slide.mobileImage) ? (
          <picture>
            {slide.mobileImage && (
              <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
            )}
            <img
              src={slide.desktopImage || slide.mobileImage}
              alt="Banner Vitally"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10 pointer-events-none" />
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} pointer-events-none`} />

        {/* Text Content */}
        <div className="absolute inset-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center sm:items-end pb-8 sm:pb-16 lg:pb-20">
            <div className="max-w-2xl space-y-3 sm:space-y-5">
              {slide.tag && (
                <span className="text-[#39FF14] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                  {slide.tag}
                </span>
              )}
              {slide.sub && (
                <p className="text-white/60 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {slide.sub}
                </p>
              )}
              {slide.cta && slide.href && (
                <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-[#39FF14] text-black text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors"
                  >
                    {slide.cta}
                    <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 z-20 flex items-center gap-2">
          <button
            onClick={() => go((current - 1 + slides.length) % slides.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 border border-white/10 text-white/70 hover:text-white hover:border-[#39FF14] transition-colors"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={16} className="mx-auto sm:w-[18px] sm:h-[18px]" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => go(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === current ? 'w-6 sm:w-8 bg-[#39FF14]' : 'w-3 sm:w-4 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir para o slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => go((current + 1) % slides.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 border border-white/10 text-white/70 hover:text-white hover:border-[#39FF14] transition-colors"
            aria-label="Próximo slide"
          >
            <ChevronRight size={16} className="mx-auto sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      )}
    </section>
  );
}
