import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Palette,
  Code,
  Smartphone,
  Zap,
  Shield,
  TrendingUp,
  Users2,
  Headphones,
  ArrowRight,
  Check,
  Star,
  Layers,
  Gauge,
  Lock,
  Globe,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

interface CustomizationService {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  popular?: boolean;
}

// Feature Card Component with Anime.js Animations
const FeatureCard = ({
  feature,
  IconComponent,
  index,
}: {
  feature: Feature;
  IconComponent: React.ElementType;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;

    // Initial state
    animeSet(cardRef.current, {
      opacity: 0,
      translateY: 40,
      scale: 0.95,
    });

    animeSet(iconRef.current, {
      scale: 0,
      rotate: -180,
    });

    // Entrance animation with delay based on index
    animeAnimate(cardRef.current, {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.95, 1],
      duration: 800,
      delay: index * 150,
      easing: "easeOutCubic",
    });

    // Icon entrance
    animeAnimate(iconRef.current, {
      scale: [0, 1.2, 1],
      rotate: [-180, 0],
      duration: 900,
      delay: index * 150 + 100,
      easing: "easeOutElastic(1, 0.5)",
    });

    // Hover effect handler
    const handleMouseEnter = () => {
      animeAnimate(cardRef.current, {
        translateY: -10,
        boxShadow: "0 20px 50px rgba(59, 130, 246, 0.3)",
        duration: 400,
        easing: "easeOutQuad",
      });

      animeAnimate(iconRef.current, {
        scale: 1.15,
        rotate: 10,
        duration: 400,
        easing: "easeOutQuad",
      });
    };

    const handleMouseLeave = () => {
      animeAnimate(cardRef.current, {
        translateY: 0,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        duration: 400,
        easing: "easeOutQuad",
      });

      animeAnimate(iconRef.current, {
        scale: 1,
        rotate: 0,
        duration: 400,
        easing: "easeOutQuad",
      });
    };

    // Active (click) effect
    const handleMouseDown = () => {
      animeAnimate(cardRef.current, {
        scale: 0.93,
        duration: 150,
        easing: "easeOutQuad",
      });
    };

    const handleMouseUp = () => {
      animeAnimate(cardRef.current, {
        scale: 1.15,
        duration: 200,
        easing: "easeOutQuad",
      });
    };

    cardRef.current.addEventListener("mouseenter", handleMouseEnter);
    cardRef.current.addEventListener("mouseleave", handleMouseLeave);
    cardRef.current.addEventListener("mousedown", handleMouseDown);
    cardRef.current.addEventListener("mouseup", handleMouseUp);

    return () => {
      cardRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      cardRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      cardRef.current?.removeEventListener("mousedown", handleMouseDown);
      cardRef.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-br from-card to-card/50 border border-primary/10 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        willChange: "transform, opacity, box-shadow",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
      <div className="relative">
        <div
          ref={iconRef}
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4`}
          style={{ willChange: "transform" }}
        >
          <IconComponent className="w-full h-full text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

const WebCustomization = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const mainFeatures: Feature[] = [
    {
      icon: Palette,
      title: "Desain Profesional",
      description:
        "Desain custom yang sesuai dengan brand identity bisnis Anda dengan pendekatan modern dan menarik",
      color: "from-primary to-accent",
    },
    {
      icon: Code,
      title: "Development Custom",
      description:
        "Coding dari nol dengan teknologi terkini dan best practices untuk performa optimal",
      color: "from-accent to-purple-500",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Tampilan sempurna di semua perangkat - desktop, tablet, dan mobile",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Kecepatan loading super cepat dengan optimasi SEO dan teknik modern",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Enkripsi SSL, HTTPS, dan proteksi data pelanggan yang komprehensif",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "SEO Ready",
      description:
        "Optimasi untuk search engine agar bisnis Anda mudah ditemukan di Google",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const services: CustomizationService[] = [
    {
      id: "startup",
      title: "Startup Package",
      description: "Paket ideal untuk bisnis baru yang ingin hadir online dengan profesional",
      features: [
        "Website 5 halaman",
        "Responsive Design",
        "Contact Form",
        "Basic SEO",
        "Admin Panel Sederhana",
        "SSL Certificate",
        "Email Support",
        "Revisi 3 kali",
      ],
      price: "Rp 499k - 999k",
    },
    {
      id: "professional",
      title: "Professional Package",
      description: "Solusi lengkap untuk bisnis yang ingin berkembang dan maksimal online",
      features: [
        "Website unlimited pages",
        "E-commerce Integration",
        "Payment Gateway",
        "Advanced SEO",
        "Admin Dashboard",
        "SSL Certificate",
        "Email & Chat Support",
        "Revisi unlimited",
        "Monthly Maintenance",
        "Analytics Integration",
      ],
      price: "Rp 999k - 1.999jt",
      popular: true,
    },
    {
      id: "enterprise",
      title: "Enterprise Package",
      description: "Paket premium dengan fitur lengkap untuk enterprise level",
      features: [
        "Semua fitur Professional",
        "Custom CMS Development",
        "Multi-language Support",
        "Advanced Security",
        "Cloud Hosting",
        "24/7 Priority Support",
        "Dedicated Account Manager",
        "Weekly Maintenance",
        "API Integration",
        "Custom Plugins & Extensions",
      ],
      price: "Rp 1.999jt - 4.999jt",
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Konsultasi",
      description: "Diskusi mendalam tentang kebutuhan, visi, dan target bisnis Anda",
    },
    {
      number: "02",
      title: "Perencanaan",
      description: "Membuat strategi dan roadmap teknis untuk kesuksesan proyek",
    },
    {
      number: "03",
      title: "Design",
      description: "Perancangan UI/UX yang menarik dan user-friendly",
    },
    {
      number: "04",
      title: "Development",
      description: "Coding dan development dengan standar kualitas tinggi",
    },
    {
      number: "05",
      title: "Testing & QA",
      description: "Testing menyeluruh untuk memastikan semua berfungsi dengan sempurna",
    },
    {
      number: "06",
      title: "Launch & Support",
      description: "Launching website dan support jangka panjang pasca-launching",
    },
  ];

  const whyChooseUs = [
    { icon: Star, title: "Pengalaman 8+ Tahun", desc: "Track record yang terbukti" },
    { icon: Users2, title: "500+ Klien Puas", desc: "Kepercayaan dari klien" },
    { icon: Code, title: "Tech Stack Modern", desc: "Teknologi terkini & terbaik" },
    { icon: Headphones, title: "Support Dedicated", desc: "Tim siap membantu Anda" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden pt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Web Custom yang
              <span className="bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
                {" "}
                Memukau
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Ciptakan kehadiran digital yang kuat dengan website custom yang dirancang khusus untuk
              bisnis Anda. Profesional, responsif, dan siap untuk pertumbuhan.
            </p>
            <Link to="/checkout">
              <button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 inline-flex items-center gap-2">
                Mulai Konsultasi Gratis <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <FeatureCard
                  key={index}
                  feature={feature}
                  IconComponent={IconComponent}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Paket Layanan
            </h2>
            <p className="text-lg text-muted-foreground">
              Pilih paket yang sesuai dengan kebutuhan dan anggaran bisnis Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  y: service.popular ? -15 : -8,
                  scale: service.popular ? 1.02 : 1.01,
                }}
                whileTap={{
                  scale: service.popular ? 0.98 : 0.96,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                onHoverStart={() => setSelectedService(service.id)}
                onHoverEnd={() => setSelectedService(null)}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  service.popular ? "md:scale-105" : ""
                } ${
                  selectedService === service.id
                    ? "shadow-2xl shadow-primary/30"
                    : "shadow-lg"
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-bl-xl text-sm font-semibold">
                    POPULER
                  </div>
                )}

                <div className="bg-gradient-to-br from-card to-card/50 border border-primary/10 backdrop-blur-xl p-8 h-full">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>

                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6 mb-8">
                    <div className="text-3xl font-bold text-foreground">
                      {service.price}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: (index * 0.15) + (idx * 0.08),
                          ease: "easeOut"
                        }}
                      >
                        <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    to={service.id === "enterprise" ? "/dashboard" : "/checkout"}
                    className="w-full"
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        service.popular
                          ? "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/50"
                          : "border border-primary/30 text-foreground hover:bg-primary/10"
                      }`}
                    >
                      Pilih Paket
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Proses Kerja Kami
            </h2>
            <p className="text-lg text-muted-foreground">
              Tahapan sistematis dan terstruktur untuk hasil maksimal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}

                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Mengapa Memilih Firanta?
            </h2>
            <p className="text-lg text-muted-foreground">
              Kami berkomitmen untuk memberikan solusi terbaik untuk bisnis digital Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Teknologi Terkini
            </h2>
            <p className="text-lg text-muted-foreground">
              Kami menggunakan stack teknologi modern untuk hasil terbaik
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "React",
              "Vue.js",
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "Node.js",
              "PostgreSQL",
              "MongoDB",
              "Firebase",
              "Prisma",
              "AWS",
              "Docker",
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-primary/20 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300"
              >
                <p className="font-semibold text-foreground">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/50 rounded-2xl p-12 backdrop-blur-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Siap untuk Transform Digital?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Hubungi tim kami hari ini untuk konsultasi gratis dan dapatkan penawaran terbaik
              untuk website custom Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout">
                <button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 justify-center">
                  Dapatkan Penawaran <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="border border-primary/50 text-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/10 transition-all duration-300">
                Chat dengan Tim Kami
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebCustomization;
