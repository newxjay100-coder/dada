import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Product } from '@/types/database.types';
import { HeroSlider } from '@/components/home/HeroSlider';
import { QuickCategory } from '@/components/home/QuickCategory';
import { TrendKeywords } from '@/components/home/TrendKeywords';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { BestRankingSection } from '@/components/home/BestRankingSection';
import { PersonalRecommendSection } from '@/components/home/PersonalRecommendSection';
import { OnePlusOneSection } from '@/components/home/OnePlusOneSection';
import { BestReviewsSection } from '@/components/home/BestReviewsSection';
import { MagazineSection } from '@/components/home/MagazineSection';
import { EventPopupModal } from '@/components/home/EventPopupModal';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 01 HERO SLIDER */}
      <HeroSlider />

      {/* 02 QUICK CATEGORY */}
      <QuickCategory />

      {/* 03 TREND / KEYWORDS */}
      <TrendKeywords />

      {/* 04 NEW ARRIVALS */}
      <NewArrivalsSection products={products} />

      {/* 05 BEST RANKING PRODUCTS */}
      <BestRankingSection products={products} />

      {/* 06 PERSONAL RECOMMENDATION */}
      <PersonalRecommendSection products={products} />

      {/* 07 1+1 SPECIAL EVENT */}
      <OnePlusOneSection products={products} />

      {/* 08 BEST REVIEWS */}
      <BestReviewsSection />

      {/* 09 STYLE / MAGAZINE */}
      <MagazineSection />

      {/* 10 EVENT POPUP MODAL */}
      <EventPopupModal />
    </div>
  );
};
