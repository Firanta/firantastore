import { motion } from "framer-motion";
import { ArrowRight, Users, Zap, Award, Heart, Rocket, Sparkles, Handshake, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Link } from "react-router-dom";
import AnimatedCounter from "./AnimatedCounter";
import AnimatedFeatureCard from "./AnimatedFeatureCard";
import AnimatedCTAButton from "./AnimatedCTAButton";
import AnimatedSectionHeader from "./AnimatedSectionHeader";

const PortfolioSection = () => {
  const { language } = useLanguage();
  const t = translations[language].portfolio;

  const stats = [
    { key: "satisfiedClients", value: "500+", icon: Heart },
    { key: "completedProjects", value: "1000+", icon: Award },
    { key: "expertTeam", value: "25+", icon: Users },
    { key: "yearsExperience", value: "8+", icon: Zap },
  ];

  const values = [
    {
      key: "innovation",
      icon: Rocket
    },
    {
      key: "quality",
      icon: Sparkles
    },
    {
      key: "trust",
      icon: Handshake
    },
    {
      key: "growth",
      icon: TrendingUp
    },
  ];

  return (
    <section id="portfolio" className="py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <AnimatedSectionHeader
            label={t.label}
            title={t.title}
            subtitle={t.subtitle}
          />
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-6">
              {t.storyTitle}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t.storyP1}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t.storyP2}
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t.storyP3}
            </p>

            <Link to="/web-custom">
              <button className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300">
                {t.learnMore} <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden glass glow-border">
              <img 
                src="https://i.ibb.co.com/kVfjmKC0/logobrandv1.jpg" 
                alt="Firanta Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-foreground mb-12"
          >
            {t.values}
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const IconComponent = value.icon;
              const valueTitle = t[value.key as "innovation" | "quality" | "trust" | "growth"];
              const valueDescKey = `${value.key}Desc` as "innovationDesc" | "qualityDesc" | "trustDesc" | "growthDesc";
              const valueDesc = t[valueDescKey];
              return (
                <AnimatedFeatureCard
                  key={value.key}
                  icon={IconComponent}
                  title={valueTitle}
                  description={valueDesc}
                  index={i}
                />
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const statLabel = t.stats[stat.key as keyof typeof t.stats];
            const numericValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
            const suffix = stat.value.replace(/\d/g, '').trim();
            
            return (
              <AnimatedCounter
                key={stat.key}
                icon={Icon}
                value={numericValue}
                suffix={suffix}
                label={statLabel}
                index={i}
              />
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">
            {t.cta}
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/web-custom">
              <AnimatedCTAButton variant="primary">
                {t.startNow} <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedCTAButton>
            </Link>
            <a href="mailto:hello@firanta.com">
              <AnimatedCTAButton variant="secondary">
                {t.contactUs}
              </AnimatedCTAButton>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
