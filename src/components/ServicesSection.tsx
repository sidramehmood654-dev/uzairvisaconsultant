import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { listEnabledServices } from "@/lib/services";
import { imageFor, iconFor } from "@/lib/media";

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data } = useQuery({ queryKey: ["services", "enabled"], queryFn: listEnabledServices });
  const services = data ?? [];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs uppercase tracking-widest text-primary">What We Offer</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="text-gradient-gold">Premium</span> Services
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Comprehensive European visa solutions tailored to your unique needs and aspirations
          </p>
        </div>

        {/* Featured services */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {services.slice(0, 2).map((service, i) => {
            const Icon = iconFor(service.icon);
            return (
              <div
                key={service.id}
                className={`group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.15)] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                <Link to={`/services/${service.slug}`} className="block relative h-56 overflow-hidden">
                  <img
                    src={imageFor(service.image_key, service.slug)}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </Link>
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <Link to={`/services/${service.slug}`} className="hover:text-primary transition-colors">{service.title}</Link>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.countries?.map((c) => (
                      <Link key={c} to={`/services/${service.slug}`} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium hover:bg-primary/20 hover:scale-105 transition-all duration-200">
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(2).map((service, i) => {
            const Icon = iconFor(service.icon);
            return (
              <div
                key={service.id}
                className={`group bg-card border border-border rounded-xl p-7 hover:border-primary/40 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.15)] ${
                  isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-12 rotate-1"
                }`}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Link to={`/services/${service.slug}`} className="hover:text-primary transition-colors">{service.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.countries?.map((c) => (
                    <Link key={c} to={`/services/${service.slug}`} className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium hover:bg-primary/20 hover:scale-105 transition-all duration-200">
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
