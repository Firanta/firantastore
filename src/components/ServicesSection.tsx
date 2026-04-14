import { Palette, Code2, Megaphone, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import AnimatedServiceCard from "./AnimatedServiceCard";
import AnimatedSectionHeader from "./AnimatedSectionHeader";

const services = [
  {
    icon: Palette,
    key: "webDesign",
  },
  {
    icon: Code2,
    key: "development",
  },
  {
    icon: Megaphone,
    key: "branding",
  },
  {
    icon: Search,
    key: "seoGrowth",
  },
];

const ServicesSection = () => {
  const { language } = useLanguage();
  const t = translations[language].services;

  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <AnimatedSectionHeader
            label={t.label}
            title={t.title}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const key = service.key as keyof typeof t;
            return (
              <AnimatedServiceCard
                key={service.key}
                icon={service.icon}
                title={t[`${key}` as any]}
                description={t[`${key}Desc` as any]}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
