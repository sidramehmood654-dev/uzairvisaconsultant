import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { GraduationCap, Heart, Briefcase, Plane, FileCheck, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import studyImg from "@/assets/study-visa.jpg";
import familyImg from "@/assets/family-visa.jpg";

const services = [
  {
    icon: GraduationCap,
    title: "Study Visa",
    description: "Pursue your higher education dreams in top European universities.",
    fullDescription: "We provide complete guidance for students aspiring to study in Europe — from university selection and admission support to visa documentation and interview preparation. Our team has helped hundreds of students get admitted to prestigious universities in Italy, Portugal, Greece, and Spain.",
    features: ["University selection guidance", "Admission application support", "Financial documentation", "Interview preparation", "Visa filing & tracking"],
    countries: ["Italy", "Portugal", "Greece", "Spain"],
    image: studyImg,
  },
  {
    icon: Heart,
    title: "Family Reunion Visa",
    description: "Reunite with your loved ones living in Europe.",
    fullDescription: "Being away from family is never easy. Our family reunion visa service helps you navigate the complex documentation and legal requirements to bring your family together in Europe. We handle everything from relationship verification documents to financial proofs.",
    features: ["Relationship documentation", "Financial requirement assessment", "Housing proof assistance", "Embassy appointment booking", "Application follow-up"],
    countries: ["Italy", "Portugal", "Greece", "Spain"],
    image: familyImg,
  },
  {
    icon: Briefcase,
    title: "Work Visa",
    description: "Build your career in Europe's growing economies.",
    fullDescription: "Whether you've received a job offer or are looking to explore work opportunities in Europe, we provide comprehensive work visa and permit services. Our expertise covers seasonal work permits, highly-skilled worker visas, and employment-based immigration.",
    features: ["Job offer verification", "Work permit application", "Employment contract review", "Skills assessment support", "Renewal & extension help"],
    countries: ["Italy", "Portugal", "Spain", "Greece"],
    image: null,
  },
  {
    icon: Plane,
    title: "Tourist / Visit Visa",
    description: "Explore the beauty of Europe hassle-free.",
    fullDescription: "Planning a trip to Europe? We make the Schengen tourist visa process simple and stress-free. From itinerary planning to document preparation, we ensure your application is complete and compelling for a smooth approval.",
    features: ["Itinerary planning assistance", "Hotel & flight booking guidance", "Travel insurance advice", "Financial proof preparation", "Schengen visa application"],
    countries: ["Schengen", "Italy", "Spain", "Greece"],
    image: null,
  },
  {
    icon: FileCheck,
    title: "Residence Permit",
    description: "Secure your long-term stay in Europe.",
    fullDescription: "For those looking to make Europe their long-term home, we provide expert guidance on residence permit applications. Whether it's based on employment, study, family, or investment, we know the requirements inside out.",
    features: ["Eligibility assessment", "Document compilation", "Application filing", "Biometric appointment booking", "Status tracking & updates"],
    countries: ["Italy", "Portugal", "Greece", "Spain"],
    image: null,
  },
  {
    icon: Building2,
    title: "Business / Investor Visa",
    description: "Expand your business into European markets.",
    fullDescription: "Entrepreneurs and investors looking to establish or expand their business in Europe can rely on our specialized visa services. We help with business plan preparation, investment documentation, and navigating the specific requirements of each country's investor visa program.",
    features: ["Business plan review", "Investment documentation", "Company registration guidance", "Golden visa programs", "Entrepreneur visa support"],
    countries: ["Portugal", "Spain", "Italy", "Greece"],
    image: null,
  },
];

const ServicesPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Our Services</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Comprehensive <span className="text-gradient-gold">Visa Solutions</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From study visas to business immigration — we offer end-to-end visa consultation services for your European journey.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-20 max-w-6xl mx-auto">
            {services.map((service, i) => {
              const ServiceCard = () => {
                const { ref, isVisible } = useScrollAnimation();
                const isEven = i % 2 === 0;
                return (
                  <div
                    ref={ref}
                    className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    <div className={isEven ? "" : "lg:order-2"}>
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">{service.fullDescription}</p>
                      <div className="space-y-3 mb-6">
                        {service.features.map((f) => (
                          <div key={f} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground">{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.countries.map((c) => (
                          <span key={c} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">{c}</span>
                        ))}
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 group"
                      >
                        Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <div className={isEven ? "" : "lg:order-1"}>
                      {service.image ? (
                        <div className="rounded-xl overflow-hidden border border-border glow-gold">
                          <img src={service.image} alt={service.title} className="w-full h-80 object-cover" loading="lazy" width={800} height={600} />
                        </div>
                      ) : (
                        <div className="glass-card rounded-xl p-12 text-center glow-gold">
                          <service.icon className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gradient-gold">{service.title}</h3>
                        </div>
                      )}
                    </div>
                  </div>
                );
              };
              return <ServiceCard key={service.title} />;
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
