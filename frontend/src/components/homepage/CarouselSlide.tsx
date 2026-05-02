import { memo } from "react";
import { Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui-news/Badge";
import { getImageUrl } from "@/lib/api";
import type { CarouselSlide as Slide } from "@/types/news";

interface Props {
  slide: Slide;
  isActive: boolean;
  isFirst: boolean;
}

function CarouselSlideImpl({ slide, isActive, isFirst }: Props) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug: slide.slug }}
      className="block absolute inset-0 transition-opacity duration-700 ease-out"
      style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
      aria-hidden={!isActive}
    >
      <img
        src={getImageUrl(slide.image)}
        alt={slide.title}
        loading={isFirst ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
        <Badge label={slide.category} variant="red" />
        <h2
          className="mt-3 mb-2 font-serif font-bold text-text-inverse leading-tight max-w-[80%]"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
        >
          {slide.title}
        </h2>
        <p className="text-white/85 text-sm md:text-base mb-3 max-w-[70%] hidden sm:block">
          {slide.subtitle}
        </p>
        <div className="flex items-center gap-3 text-white/75 text-sm">
          <span className="flex items-center gap-1.5">
            <Eye size={14} aria-hidden />
            {slide.views}
          </span>
          <span aria-hidden>·</span>
          <span>{slide.date}</span>
          <span aria-hidden>·</span>
          <span>{slide.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export const CarouselSlide = memo(CarouselSlideImpl);
