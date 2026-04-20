import { MessageSquare, FileText, Send, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  { icon: MessageSquare, title: "Free Consultation", desc: "Discuss your goals and eligibility with our experts." },
  { icon: FileText, title: "Documentation", desc: "We prepare and review all your documents meticulously." },
  { icon: Send, title: "Application Filing", desc: "Submit your application with our guided support." },
  { icon: CheckCircle, title: "Visa Approval", desc: "Celebrate your success — we're with you until the end!" },
];

const ProcessSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="process" className="py-24">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs uppercase tracking-widest text-primary">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple <span className="text-gradient-gold">4-Step</span> Process
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`relative text-center group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              {i < steps.length - 1 && (
                <div className={`hidden md:block absolute top-10 left-[60%] w-[80%] h-px transition-all duration-1000 ${
                  isVisible ? "bg-primary/30 scale-x-100" : "bg-transparent scale-x-0"
                }`} style={{ transitionDelay: `${600 + i * 200}ms`, transformOrigin: "left" }} />
              )}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_hsl(35_85%_55%_/_0.4)]">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-gold text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
