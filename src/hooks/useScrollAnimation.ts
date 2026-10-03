import { useEffect, useRef, useState } from "react";

export const useScrollAnimation = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On phones, stacked sections are very tall, so waiting for a percentage
    // of the block to be visible leaves long empty (still-hidden) areas.
    // Reveal as soon as the block enters the screen there; desktop unchanged.
    const isMobile = window.innerWidth < 768;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      isMobile ? { threshold: 0, rootMargin: "0px 0px -40px 0px" } : { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
