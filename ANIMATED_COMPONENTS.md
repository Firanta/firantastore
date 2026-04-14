# FirantaStore - Animated Components Documentation

## ✨ Komponen Animasi yang Sudah Dibuat

### 1. **AnimatedHeroTitle** ✅
- **Path**: `src/components/AnimatedHeroTitle.tsx`
- **Fungsi**: Main hero title dengan animasi character-level
- **Fitur**:
  - Entrance animation dengan scale, rotate, translateY
  - Floating effect (melambung)
  - Pulse animation
  - Breathing rotation
  - Hover 360° rotate effect
  - Glow text shadow effect

### 2. **AnimatedServiceCard** ✅
- **Path**: `src/components/AnimatedServiceCard.tsx`
- **Fungsi**: Service card dengan animasi entrance dan hover
- **Fitur**:
  - Card slide-up entrance (opacity, translateY, scale)
  - Icon rotation dan scale entrance
  - Hover lift effect
  - Icon scale pada hover
  - Staggered animation berdasarkan index

### 3. **AnimatedPackageCard** ✅
- **Path**: `src/components/AnimatedPackageCard.tsx`
- **Fungsi**: Pricing package card dengan animated feature list
- **Fitur**:
  - Card entrance dengan delay berdasarkan index
  - Staggered feature list animation
  - "Popular" badge styling
  - Hover lift effect
  - CTA button dengan gradient

### 4. **AnimatedCounter** ✅
- **Path**: `src/components/AnimatedCounter.tsx`
- **Fungsi**: Count-up animation untuk stats (500+, 1000+, dll)
- **Fitur**:
  - Counter entrance (opacity, scale, translateY)
  - Numeric animation/counting
  - Icon animation
  - Index-based staggered delays
  - Prevent re-animation dengan hasAnimated ref

### 5. **AnimatedCTAButton** ✅
- **Path**: `src/components/AnimatedCTAButton.tsx`
- **Fungsi**: Call-to-action buttons dengan glow effect
- **Fitur**:
  - Glow propagation pada hover
  - Scale animation pada mouseenter
  - Smooth transition
  - Primary dan secondary variants
  - Shadow glow effect

### 6. **AnimatedFeatureCard** ✅
- **Path**: `src/components/AnimatedFeatureCard.tsx`
- **Fungsi**: Feature/value cards dengan icon animation
- **Fitur**:
  - Card entrance animation
  - Icon scale dan rotate entrance (elastic easing)
  - Icon rotation pada hover dengan scale
  - Staggered animation per index
  - Hover translateY effect

### 7. **AnimatedSectionHeader** ✅
- **Path**: `src/components/AnimatedSectionHeader.tsx`
- **Fungsi**: Reusable section header dengan entrance effect
- **Fitur**:
  - Label scaleX entrance
  - Title translateY entrance
  - Subtitle entrance dengan delay
  - Alignment options (left, center, right)
  - Sequential timing

### 8. **AnimatedGlowText** ✅
- **Path**: `src/components/AnimatedGlowText.tsx`
- **Fungsi**: Text dengan pulsing glow effect
- **Fitur**:
  - Entrance fade-in
  - Continuous pulsing glow effect
  - Looping animation
  - Customizable glow color
  - Custom delay support

### 9. **AnimatedListItem** ✅
- **Path**: `src/components/AnimatedListItem.tsx`
- **Fungsi**: List items dengan icon animation
- **Fitur**:
  - Item slideIn dari kiri
  - Icon scale entrance (elastic)
  - Hover translateX effect
  - Icon rotation pada hover
  - Staggered per index dengan baseDelay

### 10. **AnimatedBadge** ✅
- **Path**: `src/components/AnimatedBadge.tsx`
- **Fungsi**: Badges dengan entrance dan pulse effect
- **Fitur**:
  - Scale dan rotate entrance (elastic)
  - Continuous subtle pulse
  - Multiple variants (primary, secondary, success, warning)
  - Index-based entrance delay

## 🔄 Sections yang Sudah Diupdate

### HeroSection
- ✅ Menggunakan **AnimatedHeroTitle** untuk main title
- ✅ Menggunakan **AnimatedCTAButton** untuk buttons
- ✅ Motion.div untuk label dan description (Framer Motion)

### ServicesSection
- ✅ Menggunakan **AnimatedSectionHeader** untuk header
- ✅ Menggunakan **AnimatedServiceCard** untuk service items
- ✅ Grid layout dengan 4 columns

### PackagesSection
- ✅ Menggunakan **AnimatedSectionHeader** untuk header
- ✅ Menggunakan **AnimatedPackageCard** untuk packages
- ✅ 3-column grid dengan popular badge

### PortfolioSection
- ✅ Menggunakan **AnimatedSectionHeader** untuk header
- ✅ Menggunakan **AnimatedFeatureCard** untuk values
- ✅ Menggunakan **AnimatedCounter** untuk stats section
- ✅ Menggunakan **AnimatedCTAButton** untuk CTA buttons
- ✅ Story section dengan Framer Motion

### Footer
- ✅ Entrance fade-in animation
- ✅ Staggered links animation
- ✅ Hover scale effect

## 🎨 Animasi Timing Standards

| Animasi | Duration | Delay | Easing |
|---------|----------|-------|--------|
| Entrance | 800-900ms | index * 150ms | easeOutCubic |
| Hover | 400-600ms | - | easeOutQuad |
| Icon (Elastic) | 700-900ms | +100ms | easeOutElastic |
| Glow/Pulse | 2500-3000ms | - | easeInOutQuad |
| Stagger Gap | - | 80-150ms | - |

## 📝 Anime.js API Pattern

```typescript
// Entrance animation
animeSet(ref.current, { opacity: 0, scale: 0.9 });
animeAnimate(ref.current, {
  opacity: [0, 1],
  scale: [0.9, 1],
  duration: 800,
  delay: index * 150,
  easing: 'easeOutCubic',
});

// Staggered children
animeAnimate(childRefs, {
  opacity: [0, 1],
  duration: 600,
  delay: animeStagger(80, { start: 400 }),
});

// Counter animation
const counterObj = { count: 0 };
animeAnimate(counterObj, {
  count: finalValue,
  duration: 2000,
  update(anim) {
    setDisplayValue(Math.floor((counterObj as any).count));
  },
});
```

## 🚀 Cara Menggunakan Komponen

### Contoh: AnimatedServiceCard
```typescript
<AnimatedServiceCard
  icon={PaletteIcon}
  title="Web Design"
  description="Beautiful, responsive designs"
  index={0}
/>
```

### Contoh: AnimatedCounter
```typescript
<AnimatedCounter
  icon={HeartIcon}
  value={500}
  suffix="+"
  label="Satisfied Clients"
  index={0}
/>
```

### Contoh: AnimatedCTAButton
```typescript
<AnimatedCTAButton variant="primary" onClick={handleClick}>
  Get Started <ArrowRight className="w-4 h-4 ml-2" />
</AnimatedCTAButton>
```

## ✨ Features yang Sudah Diwujudkan

✅ **Professional Animation Design** - Semua animasi smooth dan elegant  
✅ **Reusable Components** - Komponensistem yang konsisten  
✅ **Staggered Timing** - Animasi beruntun yang natural  
✅ **Hover Effects** - Interactive feedback untuk user  
✅ **Responsive** - Semua animasi bekerja di mobile & desktop  
✅ **Memory Safe** - Event listeners cleanup untuk prevent memory leaks  
✅ **Anime.js v4.3.6** - Named exports API yang benar

## 🎯 Next Steps (Optional Enhancements)

- [ ] Scroll-triggered animations (Intersection Observer)
- [ ] 3D transforms untuk advanced effects
- [ ] Stagger animation sequence untuk full page load
- [ ] Parallax scrolling effects
- [ ] Particle effects background
- [ ] SVG path animations
- [ ] Morph shape animations

## 📊 Komponen API Standard

Semua komponen animated mengikuti pola:

```typescript
interface AnimatedComponentProps {
  index?: number;      // Untuk staggered delays
  delay?: number;      // Custom base delay
  className?: string;  // Tailwind classes
  children?: React.ReactNode;
}
```

## 🔧 Debugging Tips

1. **Animasi tidak jalan**: Check console untuk anime.js errors
2. **Timing off**: Verify delay = baseDelay + index * staggerGap
3. **Memory leak**: Ensure event listeners cleanup di return() useEffect
4. **DOM timing**: Gunakan setTimeout untuk jaminin DOM render sebelum animate

---

**Last Updated**: 2024
**Anime.js Version**: ^4.3.6
**Framework**: React 18 + TypeScript
**Styling**: Tailwind CSS + shadcn/ui
