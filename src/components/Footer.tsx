import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet, stagger as animeStagger } from "animejs";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const footerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    if (!footerRef.current) return;

    // Initial state
    animeSet(footerRef.current, { opacity: 0, translateY: 20 });
    linksRef.current.forEach((link) => {
      if (link) {
        animeSet(link, { opacity: 0, translateY: 10 });
      }
    });

    // Footer entrance
    animeAnimate(footerRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: 300,
      easing: "easeOutCubic",
    });

    // Staggered links animation
    animeAnimate(
      linksRef.current.filter((l) => l),
      {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        delay: animeStagger(80, { start: 500 }),
        easing: "easeOutCubic",
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Firanta WebStore. {t.copyright}
        </p>
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">{t.followUs}:</span>
          {["Twitter", "GitHub", "Dribbble"].map((link, i) => (
            <a
              key={link}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-110"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
