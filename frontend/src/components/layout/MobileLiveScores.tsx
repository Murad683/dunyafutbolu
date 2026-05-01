import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function MobileLiveScores() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const header = document.querySelector('header');
      if (header) header.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const header = document.querySelector('header');
      if (header) header.style.paddingRight = "";
    };
  }, [isOpen]);

  const fab = (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 z-40 lg:hidden bg-[#1A1A1A] border border-surface-border shadow-dropdown px-4 py-3 rounded-full flex items-center gap-2.5 hover:scale-105 transition-transform"
      aria-label="Canlı nəticələri aç"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live-red opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-live-red"></span>
      </span>
      <span className="font-bold text-white text-sm tracking-wide">Canlı</span>
    </button>
  );

  const modal = isOpen && typeof document !== "undefined"
    ? createPortal(
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-end">
          <button 
            className="absolute inset-0 bg-black/60 animate-fade-in w-full h-full cursor-default backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
            aria-label="Bağla"
          />
          <div className="relative bg-surface-off w-full h-[80vh] rounded-t-[20px] shadow-modal flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-white rounded-t-[20px] shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-live-red"></span>
                </span>
                <h2 className="font-bold text-text-primary text-lg">Canlı Nəticələr</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-surface-light hover:bg-surface-border text-text-secondary hover:text-brand-red transition-colors"
                aria-label="Bağla"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-surface-white">
              <iframe
                src="https://www.scorebat.com/embed/livescore/?token=MzI3MDRfMTczNTY0NDIxOV8yMGY5YTVkZTViMWZlMDhkZTYzMjRhMTU1Yzk5ZTdlZTcwZTY2OGFm"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  overflow: "hidden",
                }}
                title="Canlı futbol nəticələri"
                loading="lazy"
                allowFullScreen={false}
              />
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {fab}
      {modal}
    </>
  );
}
