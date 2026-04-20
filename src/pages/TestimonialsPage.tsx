import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Star, Quote, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CircularProgress from "@/components/CircularProgress";
import { Award, Users, ThumbsUp } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Khan",
    visa: "Italy Study Visa",
    text: "Uzair Visa Consultancy made my dream of studying in Italy a reality. Their documentation support and interview preparation was outstanding! I got admitted to Sapienza University and the whole process was smooth.",
    rating: 5,
  },
  {
    name: "Fatima Noor",
    visa: "Portugal Family Reunion",
    text: "I was reunited with my husband in Portugal within 4 months. The team handled everything professionally — from document preparation to embassy coordination. Highly recommended!",
    rating: 5,
  },
  {
    name: "Hassan Ali",
    visa: "Spain Work Visa",
    text: "Got my Spanish work visa on the first attempt! The team's knowledge of European immigration laws is exceptional. They guided me through every step. Thank you UC!",
    rating: 5,
  },
  {
    name: "Sara Malik",
    visa: "Greece Study Visa",
    text: "I was confused about the visa process for Greece, but UC made everything crystal clear. From university admission to visa approval, they handled it all. Now studying in Athens!",
    rating: 5,
  },
  {
    name: "Usman Raza",
    visa: "Italy Work Visa",
    text: "Professional, reliable, and efficient. My Italy work visa was approved within the expected timeline. The team kept me informed at every stage. Excellent service!",
    rating: 5,
  },
  {
    name: "Ayesha Tariq",
    visa: "Portugal Golden Visa",
    text: "We invested through Portugal's Golden Visa program with UC's guidance. Their knowledge of investment requirements and documentation was impressive. Now we have EU residency!",
    rating: 5,
  },
];

const TestimonialsPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  return (
    <Layout>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Testimonials</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Client <span className="text-gradient-gold">Success</span> Stories
            </h1>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it — hear from our clients who successfully obtained their European visas.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className={`flex flex-wrap justify-center gap-12 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <CircularProgress value={100} max={100} label="Happy Clients" displayValue="1000+" icon={<Users className="w-5 h-5" />} delay={0} />
            <CircularProgress value={98} max={100} label="Success Rate" displayValue="98%" icon={<Award className="w-5 h-5" />} delay={200} />
            <CircularProgress value={100} max={100} label="Satisfaction" displayValue="5/5" icon={<ThumbsUp className="w-5 h-5" />} delay={400} />
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4" ref={gridRef}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`glass-card rounded-xl p-8 relative hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.15)] transition-all duration-700 group ${
                  gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6 group-hover:text-primary/40 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
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

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Write Your <span className="text-gradient-gold">Success Story?</span>
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 group"
          >
            Get Started Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default TestimonialsPage;
