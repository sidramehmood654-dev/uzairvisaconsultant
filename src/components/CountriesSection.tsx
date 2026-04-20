import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import italyImg from "@/assets/italy.jpg";
import portugalImg from "@/assets/portugal.jpg";
import greeceImg from "@/assets/greece.jpg";
import spainImg from "@/assets/spain.jpg";

const countries = [
  {
    name: "Italy",
    image: italyImg,
    description: "Study in world-renowned universities, work in fashion & design, or reunite with family in the heart of Europe.",
    visas: ["Study Visa", "Work Visa", "Family Reunion", "Residence Permit"],
  },
  {
    name: "Portugal",
    image: portugalImg,
    description: "Enjoy affordable living, excellent education, and a golden visa pathway in this beautiful Atlantic nation.",
    visas: ["Study Visa", "Golden Visa", "Work Permit", "Family Reunion"],
  },
  {
    name: "Greece",
    image: greeceImg,
    description: "Experience Mediterranean living with affordable education, growing job market, and rich cultural heritage.",
    visas: ["Study Visa", "Work Visa", "Family Reunion", "Investor Visa"],
  },
  {
    name: "Spain",
    image: spainImg,
    description: "From Barcelona to Madrid — study, work, or settle in one of Europe's most vibrant and welcoming countries.",
    visas: ["Study Visa", "Work Visa", "Family Reunion", "Entrepreneur Visa"],
  },
];

const CountriesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="countries" className="py-24 bg-card">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs uppercase tracking-widest text-primary">Destinations</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your <span className="text-gradient-gold">European</span> Destinations
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            We specialize in visa services for these four stunning European countries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {countries.map((country, i) => (
            <div
              key={country.name}
              className={`group relative rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.2)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <h3
                  className="absolute bottom-4 left-6 text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {country.name}
                </h3>
              </div>
              <div className="p-6 bg-card">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{country.description}</p>
                <div className="flex flex-wrap gap-2">
                  {country.visas.map((visa) => (
                    <Link
                      key={visa}
                      to="/services"
                      className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                      {visa}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;
