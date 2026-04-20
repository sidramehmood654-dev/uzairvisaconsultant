import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { MessageSquare, FileText, Send, CheckCircle, ArrowRight, Clock, Shield, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: MessageSquare,
    title: "Free Consultation",
    desc: "Book a free consultation with our visa experts. We'll assess your eligibility, discuss your goals, and recommend the best visa pathway for your situation.",
    details: ["30-minute detailed session", "Eligibility assessment", "Visa pathway recommendation", "Cost breakdown & timeline"],
  },
  {
    icon: FileText,
    title: "Documentation",
    desc: "Our team prepares a comprehensive checklist of required documents and guides you through gathering and organizing everything the embassy needs.",
    details: ["Personalized document checklist", "Document verification & review", "Translation assistance", "Financial proof guidance"],
  },
  {
    icon: Send,
    title: "Application Filing",
    desc: "We file your visa application with precision, ensuring every form is correctly filled and every document is properly attached. We also schedule your embassy appointment.",
    details: ["Form filling assistance", "Embassy appointment booking", "Application submission", "Interview coaching"],
  },
  {
    icon: CheckCircle,
    title: "Visa Approval",
    desc: "We track your application status and keep you updated at every step. Once approved, we help you with travel preparation and settlement guidance.",
    details: ["Application status tracking", "Real-time updates", "Travel preparation tips", "Post-arrival settlement help"],
  },
];

const ProcessPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  return (
    <Layout>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">How It Works</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our <span className="text-gradient-gold">4-Step</span> Process
            </h1>
            <p className="text-lg text-muted-foreground">
              A simple, transparent, and effective process that takes you from consultation to visa approval.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, i) => {
              const StepCard = () => {
                const { ref, isVisible } = useScrollAnimation();
                return (
                  <div
                    ref={ref}
                    className={`grid md:grid-cols-[80px_1fr] gap-8 transition-all duration-700 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative group-hover:scale-110 transition-all">
                        <step.icon className="w-8 h-8 text-primary" />
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-gold text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                      </div>
                      {i < steps.length - 1 && <div className="w-px h-full bg-border mt-4 hidden md:block" />}
                    </div>
                    <div className="glass-card rounded-xl p-8">
                      <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{step.desc}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.details.map((d) => (
                          <div key={d} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              };
              return <StepCard key={step.title} />;
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Start Your <span className="text-gradient-gold">Journey?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Book your free consultation today and take the first step towards your European dream.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { icon: Clock, label: "Quick Processing" },
              { icon: Shield, label: "98% Success Rate" },
              { icon: Headphones, label: "24/7 Support" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 group"
          >
            Book Free Consultation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ProcessPage;
