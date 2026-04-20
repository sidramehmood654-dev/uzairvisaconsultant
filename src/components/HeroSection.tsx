import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Globe, Shield, Award, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import heroRome from "@/assets/hero-rome.jpg";
import heroLisbon from "@/assets/hero-lisbon.jpg";
import heroSantorini from "@/assets/hero-santorini.jpg";
import heroBarcelona from "@/assets/hero-barcelona.jpg";
import CircularProgress from "./CircularProgress";

const slides = [
  { image: heroRome, country: "Italy", tagline: "Study & Work in the Heart of Europe" },
  { image: heroLisbon, country: "Portugal", tagline: "Gateway to European Residency" },
  { image: heroSantorini, country: "Greece", tagline: "Mediterranean Dreams Await" },
  { image: heroBarcelona, country: "Spain", tagline: "Vibrant Culture, Endless Opportunities" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textKey, setTextKey] = useState(0);

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setDirection(dir);
      setCurrent(next);
      setTextKey((k) => k + 1);
      setTimeout(() => setIsTransitioning(false), 900);
    },
    [isTransitioning]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length, 1), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Full-screen Hero Image ── */}
      <div className="absolute inset-0 perspective-1000">
        {slides.map((slide, i) => (
          <div
            key={slide.country}
            className="absolute inset-0 transition-all duration-[900ms] ease-in-out preserve-3d"
            style={{
              opacity: i === current ? 1 : 0,
              transform:
                i === current
                  ? "scale(1.02) rotateY(0deg)"
                  : i === (current - direction + slides.length) % slides.length
                  ? `scale(1.15) rotateY(${direction * -10}deg)`
                  : `scale(0.9) rotateY(${direction * 10}deg)`,
            }}
          >
            <img
              src={slide.image}
              alt={slide.country}
              className={`w-full h-full object-cover ${
                i === current ? "animate-ken-burns" : "scale-100"
              }`}
              width={1920}
              height={1080}
            />
          </div>
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
      </div>

      {/* ── Top Announcement Banner ── */}
      <div className="relative z-20 mt-16 md:mt-20">
        <div className="bg-primary/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-2 animate-slide-down">
            <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-primary-foreground tracking-wide">
              🎓 Limited Slots Available — Apply for European Study Visa 2026 Now!
            </span>
            <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
      >
        <ChevronLeft className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
      >
        <ChevronRight className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
      </button>

      {/* ── Hero Content over image ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge — from top-left */}
            <div
              key={`badge-${textKey}`}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full mb-8 animate-from-top-left"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-white/80">
                Your Trusted European Visa Experts
              </span>
            </div>

            {/* Heading — from top-right */}
            <h1
              key={`h1-${textKey}`}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 text-white animate-from-top-right"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Dream of{" "}
              <span className="text-gradient-gold">Europe</span>{" "}
              Starts Here
            </h1>

            {/* Dynamic country tagline */}
            <div className="h-8 mb-6 overflow-hidden relative">
              {slides.map((slide, i) => (
                <p
                  key={slide.country}
                  className="text-primary font-medium tracking-wide absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
                  style={{
                    opacity: i === current ? 1 : 0,
                    transform: i === current
                      ? "translateY(0) scale(1)"
                      : i === (current - 1 + slides.length) % slides.length
                      ? "translateY(-100%) scale(0.9)"
                      : "translateY(100%) scale(0.9)",
                  }}
                >
                  {slide.country} — {slide.tagline}
                </p>
              ))}
            </div>

            {/* Description — from bottom-left */}
            <p
              key={`desc-${textKey}`}
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 animate-from-bottom-left"
            >
              Expert visa consultation for Italy, Portugal, Greece & Spain.
              Study abroad, reunite with family, or build your career in Europe with Uzair Visa Consultancy.
            </p>

            {/* CTAs — from bottom-right */}
            <div
              key={`cta-${textKey}`}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-from-bottom-right"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_-5px_hsl(42_70%_50%_/_0.5)] hover:scale-105 transition-all duration-300 group"
              >
                Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-primary/60 hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                Our Services
              </a>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center gap-3 mb-12">
              {slides.map((slide, i) => (
                <button
                  key={slide.country}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={`transition-all duration-500 rounded-full ${
                    i === current
                      ? "w-10 h-3 bg-gradient-gold"
                      : "w-3 h-3 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Circular Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <CircularProgress
                value={4}
                max={4}
                label="European Countries"
                displayValue="4"
                icon={<Globe className="w-5 h-5" />}
                delay={0}
              />
              <CircularProgress
                value={98}
                max={100}
                label="Success Rate"
                displayValue="98%"
                icon={<Shield className="w-5 h-5" />}
                delay={200}
              />
              <CircularProgress
                value={100}
                max={100}
                label="Visas Approved"
                displayValue="1000+"
                icon={<Award className="w-5 h-5" />}
                delay={400}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
