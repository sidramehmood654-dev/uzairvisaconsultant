import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { listEnabledCountries } from "@/lib/countries";
import { imageFor } from "@/lib/media";

const CountriesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data: countries } = useQuery({ queryKey: ["countries", "enabled"], queryFn: listEnabledCountries });

  return (
    <section id="countries" className="py-24 bg-card">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs uppercase tracking-widest text-primary">Destinations</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your <span className="text-gradient-gold">European</span> Destinations
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            We specialize in visa services for these stunning European countries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {(countries ?? []).map((country, i) => (
            <div
              key={country.id}
              className={`group relative rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.2)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <Link to={`/destinations/${country.slug}`} className="block relative h-64 overflow-hidden">
                <img
                  src={imageFor(country.image_key, country.slug)}
                  alt={`${country.name} visa services`}
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
              </Link>
              <div className="p-6 bg-card">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{country.summary || country.description}</p>
                <div className="flex flex-wrap gap-2">
                  {country.visa_types?.map((visa) => (
                    <Link
                      key={visa}
                      to={`/destinations/${country.slug}`}
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
