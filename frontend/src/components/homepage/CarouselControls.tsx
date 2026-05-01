import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  count: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}

export function CarouselControls({ count, current, onPrev, onNext, onSelect }: Props) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Əvvəlki slayd"
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-pill w-10 h-10 items-center justify-center transition-colors backdrop-blur-sm"
      >
        <ChevronLeft size={22} aria-hidden />
      </button>
      <button
        onClick={onNext}
        aria-label="Növbəti slayd"
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-pill w-10 h-10 items-center justify-center transition-colors backdrop-blur-sm"
      >
        <ChevronRight size={22} aria-hidden />
      </button>

      <div className="absolute bottom-3 right-6 flex items-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Slayd ${i + 1}`}
            className={
              i === current
                ? "w-6 h-2 rounded-full bg-white transition-all duration-300"
                : "w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300"
            }
          />
        ))}
      </div>
    </>
  );
}
