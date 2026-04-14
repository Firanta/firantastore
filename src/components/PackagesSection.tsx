import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import AnimatedPackageCard from "./AnimatedPackageCard";
import AnimatedSectionHeader from "./AnimatedSectionHeader";

const packageNames = ["starter", "pro", "elite"];

const PackagesSection = () => {
  const { language } = useLanguage();
  const t = translations[language].packages;

  const packages = [
    {
      key: "starter",
      price: "499k - 999k",
      suffix: "",
      popular: false,
      features: t.starterFeatures,
    },
    {
      key: "pro",
      price: "999k - 1.999jt",
      suffix: "",
      popular: true,
      features: t.proFeatures,
    },
    {
      key: "elite",
      price: "1.999jt - 4.999jt",
      suffix: "",
      popular: false,
      features: t.eliteFeatures,
    },
  ];

  return (
    <section id="packages" className="py-32 relative mesh-gradient">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <AnimatedSectionHeader
            label={t.label}
            title={t.title}
            subtitle={t.subtitle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {packages.map((pkg, i) => {
            const key = pkg.key as "starter" | "pro" | "elite";
            const nameKey = `${key}` as any;
            const audienceKey = `${key}Audience` as any;
            const descKey = `${key}Desc` as any;
            return (
              <AnimatedPackageCard
                key={pkg.key}
                title={t[nameKey]}
                price={pkg.price}
                audience={t[audienceKey]}
                description={t[descKey]}
                features={pkg.features}
                isPopular={pkg.popular}
                index={i}
                onCtaClick={() => {
                  // Handle CTA click
                  if (import.meta.env.DEV) {
                    console.log(`Clicked: ${pkg.key}`);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
