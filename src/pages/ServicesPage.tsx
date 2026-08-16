import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Seo from "@/components/Seo";
import { listEnabledServices, Service } from "@/lib/services";
import { imageFor, iconFor } from "@/lib/media";

const ServiceBlock = ({ service, index }: { service: Service; index: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  const isEven = index % 2 === 0;
  const Icon = iconFor(service.icon);
  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className={isEven ? "" : "lg:order-2"}>
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          {service.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{service.description || service.summary}</p>
        <div className="space-y-3 mb-6">
          {service.features?.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {service.countries?.map((c) => (
            <span key={c} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">{c}</span>
          ))}
        </div>
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 group"
        >
          View details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className={isEven ? "" : "lg:order-1"}>
        <Link to={`/services/${service.slug}`} className="block rounded-xl overflow-hidden border border-border glow-gold">
          <img
            src={imageFor(service.image_key, service.slug)}
            alt={service.title}
            className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
            width={800}
            height={600}
          />
        </Link>
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { data: services, isLoading, isError } = useQuery({ queryKey: ["services", "enabled"], queryFn: listEnabledServices });

  return (
    <Layout>
      <Seo
        title="Visa Services | Study, Work, Family & Tourist Visas"
        description="Study, family reunion, work, tourist, residence permit and business visa services with document review and end-to-end guidance."
        path="/services"
      />
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

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-20 max-w-6xl mx-auto">
            {isLoading && <div className="h-64 rounded-xl bg-card animate-pulse" />}
            {isError && <p className="text-center text-muted-foreground">Unable to load services right now. Please try again shortly.</p>}
            {services?.map((s, i) => <ServiceBlock key={s.id} service={s} index={i} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
