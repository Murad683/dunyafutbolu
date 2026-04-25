import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useModal } from "@/context/ModalContext";

export function ComingSoonModal() {
  const { isOpen, closeModal } = useModal();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtnRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocusedRef.current?.focus?.();
    };
  }, [isOpen, closeModal]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in"
      onClick={closeModal}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-surface-white rounded-modal shadow-modal w-full max-w-[440px] px-10 py-12 sm:px-14 sm:py-12 text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mx-auto mb-6 flex items-center justify-center rounded-full"
          style={{
            width: 72,
            height: 72,
            backgroundColor: "#FFF8F0",
            border: "2px solid var(--brand-gold-light)",
          }}
          aria-hidden
        >
          <span className="text-4xl">⚽</span>
        </div>
        <h2 id="modal-title" className="text-[2rem] font-bold text-text-primary mb-2">
          Tezliklə
        </h2>
        <p className="text-[0.9375rem] text-text-secondary leading-relaxed mb-8">
          Bu bölmə hazırlanır. Yeniliklərdən xəbərdar olmaq üçün bizimlə qalın!
        </p>
        <button
          ref={closeBtnRef}
          onClick={closeModal}
          className="w-full bg-brand-red hover:bg-brand-red-hover text-text-inverse font-semibold text-[0.9375rem] py-3 rounded-button transition-colors"
        >
          Bağla
        </button>
        <button
          onClick={closeModal}
          className="mt-4 text-[0.8125rem] text-text-muted hover:text-text-secondary transition-colors"
        >
          ← Ana səhifəyə qayıt
        </button>
      </div>
    </div>,
    document.body,
  );
}
