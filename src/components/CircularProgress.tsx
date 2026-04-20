import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  displayValue: string;
  icon: React.ReactNode;
  delay?: number;
}

const CircularProgress = ({ value, max, label, displayValue, icon, delay = 0 }: CircularProgressProps) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    if (!isVisible) {
      setAnimatedValue(0);
      return;
    }
    const timer = setTimeout(() => {
      const duration = 3500;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedValue(eased * percentage);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [isVisible, percentage, delay]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-32 h-32 md:w-36 md:h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-100"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(43 80% 70%)" />
              <stop offset="50%" stopColor="hsl(43 72% 54%)" />
              <stop offset="100%" stopColor="hsl(25 80% 50%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-primary mb-1">{icon}</div>
          <span className="text-xl md:text-2xl font-bold text-gradient-gold">{displayValue}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-3 text-center">{label}</span>
    </div>
  );
};

export default CircularProgress;
