import { motion } from "framer-motion";
import { ExternalLink, Code2, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const samples = [
  {
    id: 1,
    title: "Sarapan Pagi 3 Saudara",
    description: "Website restoran dengan menu showcase, order online, dan reservasi meja yang interaktif.",
    category: "Restaurant",
    tech: ["React", "Firebase", "Tailwind CSS"],
    color: "from-orange-500/20 to-red-500/20",
    liveUrl: "https://sarapanpagi3saudara.web.app",
    codeUrl: "#",
  },
  {
    id: 2,
    title: "Fleuriffy Florist",
    description: "Platform toko bunga dengan katalog produk lengkap, checkout, dan delivery tracking.",
    category: "E-Commerce",
    tech: ["React", "Firebase", "Stripe"],
    color: "from-pink-500/20 to-rose-500/20",
    liveUrl: "https://fleuriffyfloristt.web.app",
    codeUrl: "#",
  },
  {
    id: 3,
    title: "Birthday 22th Celebration",
    description: "Website event perayaan dengan gallery foto, guest book, dan timeline interaktif.",
    category: "Event",
    tech: ["React", "Firebase", "Tailwind CSS"],
    color: "from-purple-500/20 to-pink-500/20",
    liveUrl: "https://brithday22th.web.app",
    codeUrl: "#",
  },
  {
    id: 4,
    title: "Neon Studio Website",
    description: "Agensi desain modern dengan animated hero section dan smooth scroll.",
    category: "Design Agency",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    color: "from-blue-500/20 to-purple-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 5,
    title: "Aether Labs Dashboard",
    description: "Dashboard analytics dengan data visualization dan real-time updates.",
    category: "SaaS",
    tech: ["React", "TypeScript", "Recharts"],
    color: "from-emerald-500/20 to-cyan-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 6,
    title: "Pulse Finance App",
    description: "Aplikasi fintech dengan fitur transfer, investment, dan portfolio tracking.",
    category: "Fintech",
    tech: ["React Native", "Firebase", "Node.js"],
    color: "from-orange-500/20 to-amber-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 7,
    title: "Void Interactive Platform",
    description: "Platform kolaborasi real-time dengan live editing dan instant notifications.",
    category: "Productivity",
    tech: ["Next.js", "WebSocket", "PostgreSQL"],
    color: "from-violet-500/20 to-indigo-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 8,
    title: "Stratos Cloud Storage",
    description: "Cloud storage solution dengan drag-drop upload dan file management.",
    category: "Cloud Services",
    tech: ["Next.js", "AWS S3", "Typescript"],
    color: "from-cyan-500/20 to-blue-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 9,
    title: "Obsidian E-Commerce",
    description: "Platform e-commerce lengkap dengan product showcase dan checkout flow.",
    category: "E-Commerce",
    tech: ["Next.js", "Stripe", "MongoDB"],
    color: "from-rose-500/20 to-orange-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 10,
    title: "Nebula Social Network",
    description: "Aplikasi social media dengan feed, messaging, dan user profiles.",
    category: "Social",
    tech: ["React", "Firebase", "Realtime DB"],
    color: "from-pink-500/20 to-red-500/20",
    liveUrl: "#",
    codeUrl: "#",
  },
];

const ProductSamples = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Sampel Produk
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Karya-Karya Kami yang Menginspirasi
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Lihat portofolio lengkap produk-produk kami yang telah dikembangkan untuk klien 
              di berbagai industri. Setiap project adalah hasil kolaborasi dan dedikasi tim kami.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Proyek Selesai", value: "150+" },
              { label: "Klien Puas", value: "98%" },
              { label: "Tim Developer", value: "25+" },
              { label: "Tahun Berpengalaman", value: "8+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Samples Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samples.map((sample, i) => (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden glass glow-border hover:glow-border-primary transition-all duration-500 flex flex-col h-full"
              >
                {/* Preview */}
                <div className={`relative h-56 bg-gradient-to-br ${sample.color} overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <Code2 className="w-10 h-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">{sample.category}</p>
                  </div>

                  {/* Hover Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={sample.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Live Demo
                    </a>
                    <a
                      href={sample.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer"
                    >
                      <Code2 className="w-4 h-4" />
                      Source
                    </a>
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {sample.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {sample.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {sample.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <a
                    href={sample.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-sm font-medium cursor-pointer"
                  >
                    Lihat Demo <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Teknologi
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">
              Tech Stack Terdepan
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Kami menggunakan teknologi terbaru untuk memastikan performa optimal dan scalability.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Node.js", "PostgreSQL", "AWS"].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-xl p-4 text-center border border-primary/20 hover:border-primary/50 transition-colors duration-300"
              >
                <p className="font-semibold text-foreground">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative mesh-gradient">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Ingin Membuat Produk Serupa?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Mari kita diskusikan visi Anda. Tim kami siap membantu mewujudkan ide brilian Anda 
              menjadi kenyataan digital yang luar biasa.
            </p>
            <Button size="lg" className="rounded-full">
              Hubungi Kami Sekarang
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductSamples;
