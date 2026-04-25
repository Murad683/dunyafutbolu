import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { NavBar } from "./NavBar";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface-white shadow-header">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center shrink-0" aria-label="Dünya Futbolu — Ana səhifə">
            <img
              src={logo}
              alt="Dünya Futbolu loqosu"
              width={44}
              height={44}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="ml-2.5 hidden sm:inline font-bold text-text-primary tracking-tight">
              Dünya Futbolu
            </span>
          </Link>

          <div className="hidden lg:block">
            <NavBar />
          </div>

          <div className="flex-1 flex items-center justify-end gap-2">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menyu"
              aria-expanded={mobileOpen}
              className="lg:hidden p-2 rounded-button hover:bg-surface-light transition-colors text-text-secondary hover:text-brand-red"
            >
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden px-4 pb-3 -mt-1">
          <SearchBar variant="mobile" />
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
