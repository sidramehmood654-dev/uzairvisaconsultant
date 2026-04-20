import { CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CircularProgress from "./CircularProgress";
import { Globe, Shield, Award, Headphones } from "lucide-react";

const highlights = [
  "Specialized in European visa processing",
  "Transparent pricing with no hidden charges",
  "Dedicated case officer for every client",
  "Embassy appointment scheduling support",
  "Interview coaching & mock sessions",
  "End-to-end documentation assistance",
];

const AboutSection = () => {
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            ref={leftRef}
            className={`transition-all duration-700 ${leftVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <span className="text-xs uppercase tracking-widest text-primary">About Us</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Choose{" "}
              <span className="text-gradient-gold">Uzair Visa Consultancy?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Uzair Visa Consultancy is your trusted partner for European immigration. We specialize
              exclusively in Italy, Portugal, Greece, and Spain — giving us deep expertise in the
              visa processes, documentation requirements, and embassy procedures of these countries.
              Our personalized approach ensures the highest success rate for our clients.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    leftVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef}
            className={`transition-all duration-700 ${rightVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
          >
            <div className="relative">
              <div className="glass-card rounded-xl p-10 glow-gold">
                <div className="grid grid-cols-2 gap-8">
                  <CircularProgress value={100} max={100} label="Visas Approved" displayValue="1000+" icon={<Award className="w-5 h-5" />} delay={0} />
                  <CircularProgress value={4} max={4} label="Countries Covered" displayValue="4" icon={<Globe className="w-5 h-5" />} delay={200} />
                  <CircularProgress value={98} max={100} label="Approval Rate" displayValue="98%" icon={<Shield className="w-5 h-5" />} delay={400} />
                  <CircularProgress value={100} max={100} label="Client Support" displayValue="24/7" icon={<Headphones className="w-5 h-5" />} delay={600} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
