import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Ahmed Khan",
    visa: "Italy Study Visa",
    text: "Uzair Visa Consultancy made my dream of studying in Italy a reality. Their documentation support and interview preparation was outstanding!",
    rating: 5,
  },
  {
    name: "Fatima Noor",
    visa: "Portugal Family Reunion",
    text: "I was reunited with my husband in Portugal within 4 months. The team handled everything professionally. Highly recommended!",
    rating: 5,
  },
  {
    name: "Hassan Ali",
    visa: "Spain Work Visa",
    text: "Got my Spanish work visa on the first attempt! The team's knowledge of European immigration laws is exceptional. Thank you UC!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="testimonials" className="py-24 bg-card">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs uppercase tracking-widest text-primary">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Client <span className="text-gradient-gold">Success</span> Stories
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`glass-card rounded-xl p-8 relative hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.15)] transition-all duration-700 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6 group-hover:text-primary/40 transition-colors" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-primary">{t.visa}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
