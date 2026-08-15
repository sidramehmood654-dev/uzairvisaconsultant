import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, MapPin, GraduationCap, Briefcase, Heart, Building2 } from "lucide-react";
import italyImg from "@/assets/italy.jpg";
import portugalImg from "@/assets/portugal.jpg";
import greeceImg from "@/assets/greece.jpg";
import spainImg from "@/assets/spain.jpg";
import Seo from "@/components/Seo";

const countries = [
  {
    name: "Italy",
    image: italyImg,
    capital: "Rome",
    description: "Italy offers world-class education, rich cultural heritage, and excellent career opportunities. From the fashion capital of Milan to the historic streets of Rome, Italy is a dream destination for students, workers, and families alike.",
    highlights: ["Top-ranked universities (Bologna, Sapienza, Politecnico)", "Affordable tuition for international students", "Post-study work permit options", "Family reunification within 6-12 months", "Rich cultural & lifestyle experience"],
    visas: [
      { icon: GraduationCap, label: "Study Visa" },
      { icon: Briefcase, label: "Work Visa" },
      { icon: Heart, label: "Family Reunion" },
      { icon: Building2, label: "Residence Permit" },
    ],
  },
  {
    name: "Portugal",
    image: portugalImg,
    capital: "Lisbon",
    description: "Portugal is one of Europe's most welcoming countries for immigrants. With its Golden Visa program, affordable cost of living, and beautiful Atlantic coastline, Portugal is perfect for those seeking a new beginning in Europe.",
    highlights: ["Golden Visa investment program", "Affordable cost of living", "Growing tech & startup ecosystem", "Path to EU citizenship", "Warm climate & friendly people"],
    visas: [
      { icon: GraduationCap, label: "Study Visa" },
      { icon: Building2, label: "Golden Visa" },
      { icon: Briefcase, label: "Work Permit" },
      { icon: Heart, label: "Family Reunion" },
    ],
  },
  {
    name: "Greece",
    image: greeceImg,
    capital: "Athens",
    description: "Greece combines ancient history with modern opportunities. With affordable education, a growing economy, and Mediterranean lifestyle, Greece is an increasingly popular destination for international students and professionals.",
    highlights: ["Affordable university programs", "Low cost of living compared to Western Europe", "Growing tourism & hospitality sector", "Investor visa programs available", "Mediterranean climate & lifestyle"],
    visas: [
      { icon: GraduationCap, label: "Study Visa" },
      { icon: Briefcase, label: "Work Visa" },
      { icon: Heart, label: "Family Reunion" },
      { icon: Building2, label: "Investor Visa" },
    ],
  },
  {
    name: "Spain",
    image: spainImg,
    capital: "Madrid",
    description: "Spain is one of Europe's most vibrant and diverse countries. From Barcelona's architecture to Madrid's business districts, Spain offers outstanding opportunities for education, employment, and entrepreneurship.",
    highlights: ["World-renowned universities & business schools", "Entrepreneur visa for startup founders", "Strong job market in tech & tourism", "Family-friendly immigration policies", "Vibrant culture & excellent quality of life"],
    visas: [
      { icon: GraduationCap, label: "Study Visa" },
      { icon: Briefcase, label: "Work Visa" },
      { icon: Heart, label: "Family Reunion" },
      { icon: Building2, label: "Entrepreneur Visa" },
    ],
  },
];

const DestinationsPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  return (
    <Layout>
      <Seo title="Destinations | Italy, Portugal, Greece & Spain Visas" description="Explore visa options, fees and processing times for Italy, Portugal, Greece and Spain with Uzair Visa Consultancy." path="/destinations" />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Destinations</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your <span className="text-gradient-gold">European</span> Destinations
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore the four stunning European countries where we provide expert visa consultation services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-24 max-w-6xl mx-auto">
            {countries.map((country, i) => {
              const CountryCard = () => {
                const { ref, isVisible } = useScrollAnimation();
                const isEven = i % 2 === 0;
                return (
                  <div ref={ref} className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    <div className={isEven ? "" : "lg:order-2"}>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">{country.capital}</span>
                      </div>
                      <h2 className="text-4xl font-bold mb-4 text-gradient-gold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {country.name}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">{country.description}</p>
                      <div className="space-y-3 mb-6">
                        {country.highlights.map((h) => (
                          <div key={h} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-foreground">{h}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {country.visas.map((v) => (
                          <div key={v.label} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                            <v.icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{v.label}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 group"
                      >
                        Apply for {country.name} Visa <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <div className={isEven ? "" : "lg:order-1"}>
                      <div className="rounded-xl overflow-hidden border border-border glow-gold group">
                        <img src={country.image} alt={country.name} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" width={800} height={600} />
                      </div>
                    </div>
                  </div>
                );
              };
              return <CountryCard key={country.name} />;
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DestinationsPage;
