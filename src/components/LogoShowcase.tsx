import { useState } from 'react';
import BrandLogo from './BrandLogo';
import AnimatedText from './AnimatedText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LogoShowcase = () => {
  const [selectedBrandAnimation, setSelectedBrandAnimation] = useState<
    'wave' | 'bounce' | 'spin' | 'color' | 'pulse' | 'glow' | 'flip'
  >('wave');
  const [selectedTextAnimation, setSelectedTextAnimation] = useState<
    'typewriter' | 'letterPop' | 'slideIn' | 'fadeInScale' | 'glitch' | 'morphing'
  >('typewriter');
  const [brandText, setBrandText] = useState('FIRANTA STORE');
  const [brandColor, setBrandColor] = useState('#1F2937');
  const [brandFontSize, setBrandFontSize] = useState(48);

  const brandAnimations = ['wave', 'bounce', 'spin', 'color', 'pulse', 'glow', 'flip'] as const;
  const textAnimations = ['typewriter', 'letterPop', 'slideIn', 'fadeInScale', 'glitch', 'morphing'] as const;

  const resetAnimations = () => {
    setSelectedBrandAnimation('wave');
    setSelectedTextAnimation('typewriter');
    setBrandText('FIRANTA STORE');
    setBrandColor('#1F2937');
    setBrandFontSize(48);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">
          Animated Brand Logo Showcase
        </h1>
        <p className="text-center text-slate-300 mb-12">
          Dibuat dengan Anime.js untuk animasi yang smooth dan profesional
        </p>

        {/* Brand Logo Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Brand Logo Animation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900 rounded-lg p-8 flex items-center justify-center min-h-32">
                <BrandLogo
                  text={brandText}
                  animationType={selectedBrandAnimation}
                  fontSize={brandFontSize}
                  color={brandColor}
                  duration={1500}
                  delay={100}
                  loop={true}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Animasi Tipe:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {brandAnimations.map((anim) => (
                      <Button
                        key={anim}
                        onClick={() => setSelectedBrandAnimation(anim)}
                        variant={selectedBrandAnimation === anim ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {anim.charAt(0).toUpperCase() + anim.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Teks:
                  </label>
                  <input
                    type="text"
                    value={brandText}
                    onChange={(e) => setBrandText(e.target.value)}
                    maxLength={20}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Font Size: {brandFontSize}px
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={brandFontSize}
                    onChange={(e) => setBrandFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Warna:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-cyan-500 border-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Text Animation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900 rounded-lg p-8 flex items-center justify-center min-h-32">
                <AnimatedText
                  text={brandText}
                  variant={selectedTextAnimation}
                  speed={50}
                  fontSize={32}
                  color={brandColor}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Tipe Animasi:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {textAnimations.map((anim) => (
                      <Button
                        key={anim}
                        onClick={() => setSelectedTextAnimation(anim)}
                        variant={selectedTextAnimation === anim ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {anim.split(/(?=[A-Z])/).join(' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded p-3">
                  <p className="text-blue-200 text-xs">
                    💡 Setiap teks animasi memiliki efek yang berbeda-beda dan smooth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Animation Details */}
        <Card className="bg-slate-800 border-amber-500 border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-white">📚 Daftar Animasi Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-purple-400 font-bold mb-4">Brand Logo Animations:</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• <span className="text-cyan-400">Wave:</span> Teks bergerak seperti gelombang</li>
                  <li>• <span className="text-cyan-400">Bounce:</span> Huruf melompat berurutan</li>
                  <li>• <span className="text-cyan-400">Spin:</span> Huruf berputar dengan fade</li>
                  <li>• <span className="text-cyan-400">Color:</span> Perubahan warna gradual</li>
                  <li>• <span className="text-cyan-400">Pulse:</span> Efek membesar & mengecil</li>
                  <li>• <span className="text-cyan-400">Glow:</span> Cahaya bersinar dinamis</li>
                  <li>• <span className="text-cyan-400">Flip:</span> Rotasi 3D dengan opacity</li>
                </ul>
              </div>

              <div>
                <h3 className="text-cyan-400 font-bold mb-4">Text Animations:</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• <span className="text-amber-400">Typewriter:</span> Efek mengetik karakter</li>
                  <li>• <span className="text-amber-400">Letter Pop:</span> Huruf muncul dengan rotate</li>
                  <li>• <span className="text-amber-400">Slide In:</span> Huruf meluncur masuk</li>
                  <li>• <span className="text-amber-400">Fade In Scale:</span> Fade & scale bersama</li>
                  <li>• <span className="text-amber-400">Glitch:</span> Efek glitch digital</li>
                  <li>• <span className="text-amber-400">Morphing:</span> Transformasi smooth</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card className="bg-slate-800 border-green-500 border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-white">💻 Contoh Penggunaan</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 p-4 rounded overflow-x-auto text-xs text-green-400">
{`import BrandLogo from '@/components/BrandLogo';

export default function HomePage() {
  return (
    <div>
      <BrandLogo 
        text="FIRANTA STORE"
        animationType="wave"
        fontSize={48}
        color="#1F2937"
        duration={1500}
        delay={100}
        loop={true}
      />
    </div>
  );
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={resetAnimations}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold px-8 py-3 rounded-lg"
          >
            🔄 Reset ke Default
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
