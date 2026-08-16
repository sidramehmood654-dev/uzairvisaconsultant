import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, MapPin, Clock, Wallet } from "lucide-react";
import Seo from "@/components/Seo";
import { listEnabledCountries, Country } from "@/lib/countries";
import { imageFor } from "@/lib/media";

const CountryBlock = ({ country, index }: { country: Country; index: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  const isEven = index % 2 === 0;
  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className={isEven ? "" : "lg:order-2"}>
        {country.capital && (
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">{country.capital}</span>
          </div>
        )}
        <h2 className="text-4xl font-bold mb-4 text-gradient-gold" style={{ fontFamily: "'Playfair Display', serif" }}>
          {country.flag} {country.name}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{country.description || country.summary}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Wallet className="w-4 h-4 text-primary" />
            Consultancy fee: <span className="font-semibold">PKR {Number(country.fee).toLocaleString()}</span>
          </div>
          {country.processing_days && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              Processing: <span className="font-semibold">{country.processing_days}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {country.highlights?.map((h) => (
            <div key={h} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-sm text-foreground">{h}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {country.visa_types?.map((v) => (
            <span key={v} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-medium">
              {v}
            </span>
          ))}
        </div>

        <Link
          to={`/destinations/${country.slug}`}
          className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 group"
        >
          Explore {country.name} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className={isEven ? "" : "lg:order-1"}>
        <Link to={`/destinations/${country.slug}`} className="block rounded-xl overflow-hidden border border-border glow-gold group">
          <img
            src={imageFor(country.image_key, country.slug)}
            alt={`${country.name} visa services`}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            width={800}
            height={600}
          />
        </Link>
      </div>
    </div>
  );
};

const DestinationsPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { data: countries, isLoading, isError } = useQuery({ queryKey: ["countries", "enabled"], queryFn: listEnabledCountries });

  return (
    <Layout>
      <Seo
        title="Destinations | European Visa Countries & Fees"
        description="Explore visa options, fees and processing times for the European countries we serve at Uzair Visa Consultancy."
        path="/destinations"
      />
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
              Explore the European countries where we provide expert visa consultation services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-24 max-w-6xl mx-auto">
            {isLoading && (
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="h-64 rounded-xl bg-card animate-pulse" />
                <div className="h-64 rounded-xl bg-card animate-pulse" />
              </div>
            )}
            {isError && <p className="text-center text-muted-foreground">Unable to load destinations right now. Please try again shortly.</p>}
            {countries?.map((c, i) => <CountryBlock key={c.id} country={c} index={i} />)}
            {countries?.length === 0 && <p className="text-center text-muted-foreground">Destinations are being updated. Please check back soon.</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DestinationsPage;
