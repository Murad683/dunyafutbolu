import { useCallback, useEffect, useState } from "react";
import { CAROUSEL_INTERVAL_MS } from "@/config/constants";
import { carouselSlides } from "@/data/mockData";
import { CarouselSlide } from "./CarouselSlide";
import { CarouselControls } from "./CarouselControls";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = carouselSlides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, total]);

  return (
    <div
      className="relative overflow-hidden rounded-card bg-text-primary h-[280px] md:h-[400px] lg:h-[460px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Əsas xəbərlər"
    >
      <div aria-live="polite" className="absolute inset-0">
        {carouselSlides.map((slide, i) => (
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
