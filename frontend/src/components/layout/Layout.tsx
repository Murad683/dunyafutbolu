import type { ReactNode } from "react";
import { ModalProvider } from "@/context/ModalContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ComingSoonModal } from "@/components/modals/ComingSoonModal";
import { MobileLiveScores } from "./MobileLiveScores";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <Header />
      <main className="bg-surface-white min-h-screen">{children}</main>
      <Footer />
      <ComingSoonModal />
      <MobileLiveScores />
    </ModalProvider>
  );
}
