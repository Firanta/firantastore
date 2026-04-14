import BrandLogo from '@/components/BrandLogo';
import AnimatedText from '@/components/AnimatedText';
import { Button } from '@/components/ui/button';

export default function AnimatedBrandDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Hero Section dengan Brand Logo */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8">
          {/* Main Logo */}
          <div className="mb-8">
            <BrandLogo
              text="FIRANTA"
              animationType="wave"
              fontSize={72}
              color="#6366F1"
              duration={1500}
              delay={80}
              loop={true}
            />
          </div>

          {/* Tagline dengan animasi text */}
          <div className="text-2xl tracking-wider">
            <AnimatedText
              text="Create Your Dream Website"
              variant="typewriter"
              speed={60}
              fontSize={28}
              color="#1F2937"
            />
          </div>

          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Platform terpercaya untuk membuat website dan toko online dengan desain yang memukau
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold"
          >
            Mulai Gratis Sekarang
          </Button>
        </div>
      </section>

      {/* Animated Logo Examples */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Pilihan Animasi Brand Logo
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Wave Animation */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-center mb-6 min-h-32">
                <BrandLogo
                  text="FIRANTA"
                  animationType="wave"
                  fontSize={36}
                  color="#1F2937"
                  duration={1500}
                  delay={80}
                  loop={true}
                />
              </div>
              <h3 className="text-center font-bold text-lg text-gray-900">Wave Animation</h3>
              <p className="text-center text-gray-600 text-sm mt-2">
                Efek gelombang yang smooth dan natural
              </p>
            </div>

            {/* Bounce Animation */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-center mb-6 min-h-32">
                <BrandLogo
                  text="FIRANTA"
                  animationType="bounce"
                  fontSize={36}
                  color="#7C3AED"
                  duration={1500}
                  delay={100}
                  loop={true}
                />
              </div>
              <h3 className="text-center font-bold text-lg text-gray-900">Bounce Animation</h3>
              <p className="text-center text-gray-600 text-sm mt-2">
                Huruf melompat berurutan yang dinamis
              </p>
            </div>

            {/* Color Animation */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-center mb-6 min-h-32">
                <BrandLogo
                  text="FIRANTA"
                  animationType="color"
                  fontSize={36}
                  color="#FF6B6B"
                  duration={2000}
                  delay={100}
                  loop={true}
                />
              </div>
              <h3 className="text-center font-bold text-lg text-gray-900">Color Animation</h3>
              <p className="text-center text-gray-600 text-sm mt-2">
                Perubahan warna yang indah dan gradual
              </p>
            </div>
          </div>

          {/* More Animations */}
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Pulse Animation */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-center mb-6 min-h-32">
                <BrandLogo
                  text="FIRANTA"
                  animationType="pulse"
                  fontSize={36}
                  color="#F59E0B"
                  duration={1200}
                  delay={100}
                  loop={true}
                />
              </div>
              <h3 className="text-center font-bold text-lg text-gray-900">Pulse Animation</h3>
              <p className="text-center text-gray-600 text-sm mt-2">
                Efek membesar dan mengecil yang konsisten
              </p>
            </div>

            {/* Glow Animation */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-center mb-6 min-h-32 bg-gray-900 rounded">
                <BrandLogo
                  text="FIRANTA"
                  animationType="glow"
                  fontSize={36}
                  color="#60A5FA"
                  duration={1500}
                  delay={100}
                  loop={true}
                />
              </div>
              <h3 className="text-center font-bold text-lg text-gray-900">Glow Animation</h3>
              <p className="text-center text-gray-600 text-sm mt-2">
                Cahaya bersinar dinamis yang elegan
              </p>
            </div>

            {/* Spin Animation */}
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-center mb-6 min-h-32">
                <BrandLogo
                  text="FIRANTA"
                  animationType="spin"
                  fontSize={36}
                  color="#EF4444"
                  duration={1000}
                  delay={120}
                  loop={true}
                />
              </div>
              <h3 className="text-center font-bold text-lg text-gray-900">Spin Animation</h3>
              <p className="text-center text-gray-600 text-sm mt-2">
                Rotasi dan fade yang spektakuler
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Mengapa Menggunakan Animated Logo?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-white text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Modern & Engaging</h3>
              <p>Logo yang bergerak membuat brand Anda lebih memorable dan engaging</p>
            </div>

            <div className="text-white text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Smooth & Professional</h3>
              <p>Animasi yang smooth menggunakan Anime.js library yang powerful</p>
            </div>

            <div className="text-white text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Performa Optimal</h3>
              <p>Dioptimalkan untuk performa terbaik di semua perangkat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Example */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Cara Mengintegrasikan ke Project Anda
          </h2>

          <div className="bg-white rounded-lg p-8 shadow-lg space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">1. Update Navbar</h3>
              <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <BrandLogo 
        text="FIRANTA STORE" 
        animationType="wave" 
        fontSize={32}
      />
      {/* Navigation items */}
    </nav>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">2. Gunakan di Hero Section</h3>
              <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`<section className="hero">
  <BrandLogo 
    text="Your Brand" 
    animationType="bounce"
    fontSize={64}
    color="#6366F1"
    loop={true}
  />
  <p className="tagline">Your amazing tagline here</p>
</section>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
