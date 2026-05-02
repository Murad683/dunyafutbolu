import React, { useCallback, useEffect, useState } from "react";
import { CAROUSEL_INTERVAL_MS } from "@/config/constants";
import { api } from "@/lib/api";
import { toCarouselSlide } from "@/lib/mappers";
import type { Article, PaginatedResponse } from "@/types/api";
import { CarouselSlide } from "./CarouselSlide";
import { CarouselControls } from "./CarouselControls";

// Define the slide type locally or import from types if available
export interface SlideType {
  id: number;
  image: string;
  title: string;
  category: string;
  slug: string;
}


export function HeroCarousel() {
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const total = slides.length;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .get<PaginatedResponse<Article>>("/articles", { params: { limit: 50 } })
      .then((res) => {
        if (!cancelled && res.data.data.length > 0) {
          const featured = res.data.data
            .filter((a) => a.isFeatured)
            .slice(0, 5)
            .map(toCarouselSlide);
          
          if (featured.length > 0) {
            setSlides(featured);
          }
        }
      })
      .catch((err) => {
        console.error("[HeroCarousel] Failed to load featured articles", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const next = useCallback(() => {
    if (total === 0) return;
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total === 0) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, total]);

  if (isLoading && total === 0) {
    return (
      <div className="relative overflow-hidden rounded-card bg-surface-border/30 animate-pulse h-[280px] md:h-[400px] lg:h-[460px]" />
    );
  }

  if (total === 0) return null;

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    const clientX = 'touches' in e ? e.targetTouches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchStart(clientX);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStart === null) return;
    const clientX = 'touches' in e ? e.targetTouches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchEnd(clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || touchEnd === null) {
      setTouchStart(null);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="relative overflow-hidden rounded-card bg-text-primary h-[280px] md:h-[400px] lg:h-[460px] cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        onTouchEndHandler();
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
      onMouseDown={(e) => {
        setIsPaused(true);
        onTouchStart(e);
      }}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEndHandler}
      aria-roledescription="carousel"
      aria-label="Əsas xəbərlər"
    >
      <div aria-live="polite" className="absolute inset-0">
        {slides.map((slide, i) => (
          <CarouselSlide key={slide.id} slide={slide} isActive={i === current} isFirst={i === 0} />
        ))}
      </div>
      <CarouselControls
        count={total}
        current={current}
        onPrev={prev}
        onNext={next}
        onSelect={setCurrent}
      />
    </div>
  );
}
