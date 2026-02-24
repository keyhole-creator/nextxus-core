import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { href: "/", label: "Home", icon: "⬡" },
  { href: "/chat", label: "Chat", icon: "◈" },
  { href: "/directives", label: "Directives", icon: "◆" },
  { href: "/knowledge", label: "Knowledge", icon: "◇" },
  { href: "/federation", label: "Federation", icon: "⬢" },
  { href: "/terminal", label: "Terminal", icon: "▣" },
  { href: "/calibration", label: "Calibration", icon: "◎" },
  { href: "/podcasts", label: "Podcasts", icon: "▶" },
  { href: "/blog", label: "Blog", icon: "✦" },
];

export default function NavBar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#00d4ff]/15"
      style={{ background: "rgba(5,5,20,0.85)", backdropFilter: "blur(12px)" }}
      data-testid="navbar"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between h-12">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline shrink-0"
          data-testid="navbar-logo"
        >
          <img
            src="/images/nextxus-avatar.jpeg"
            alt="NextXus"
            className="w-7 h-7 rounded-full border border-[#00d4ff]/40"
          />
          <span className="text-sm font-bold text-[#00d4ff] uppercase tracking-widest font-display hidden sm:inline">
            NextXus
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1" data-testid="navbar-links">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider no-underline transition-all ${
                  active
                    ? "text-[#00ff9f] bg-[#00ff9f]/10 border border-[#00ff9f]/30"
                    : "text-[#c9c9c9]/70 hover:text-white hover:bg-white/5"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1 p-2"
          data-testid="navbar-toggle"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-[#00d4ff] transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#00d4ff] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#00d4ff] transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {open && (
        <div
          className="md:hidden border-t border-[#00d4ff]/10 px-4 pb-3 pt-2 flex flex-col gap-1"
          style={{ background: "rgba(5,5,20,0.95)" }}
          data-testid="navbar-mobile-menu"
        >
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded text-sm font-mono uppercase tracking-wider no-underline transition-all flex items-center gap-2 ${
                  active
                    ? "text-[#00ff9f] bg-[#00ff9f]/10 border border-[#00ff9f]/30"
                    : "text-[#c9c9c9]/70 hover:text-white hover:bg-white/5"
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
