import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Clock, MapPin, Wallet, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import { getCountryBySlug } from "@/lib/countries";
import { listEnabledServices } from "@/lib/services";
import { imageFor, iconFor } from "@/lib/media";

const CountryDetailPage = () => {
  const { slug = "" } = useParams();
  const { data: country, isLoading } = useQuery({ queryKey: ["country", slug], queryFn: () => getCountryBySlug(slug) });
  const { data: services } = useQuery({ queryKey: ["services", "enabled"], queryFn: listEnabledServices });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">Loading destination…</div>
      </Layout>
    );
  }

  if (!country) {
    return (
      <Layout>
        <Seo title="Destination not found | Uzair Visa Consultancy" description="This destination is not available." path={`/destinations/${slug}`} />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Destination not found</h1>
          <Link to="/destinations" className="text-primary hover:underline">Back to all destinations</Link>
        </div>
      </Layout>
    );
  }

  const relatedServices = (services ?? []).filter((s) => s.countries?.includes(country.name));

  return (
    <Layout>
      <Seo
        title={`${country.name} Visa Services, Fees & Processing Time`}
        description={country.summary || `Visa types, consultancy fees and processing times for ${country.name} with Uzair Visa Consultancy.`}
        path={`/destinations/${country.slug}`}
      />

      <section className="relative">
        <div className="h-[380px] w-full overflow-hidden">
          <img src={imageFor(country.image_key, country.slug)} alt={`${country.name} skyline`} className="w-full h-full object-cover" width={1600} height={900} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        </div>
        <div className="container mx-auto px-4 relative -mt-40 pb-8">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> All destinations
          </Link>
          {country.capital && (
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">{country.capital}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-gold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {country.flag} {country.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{country.description || country.summary}</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4 grid sm:grid-cols-3 gap-4 max-w-4xl">
          <div className="glass-card rounded-xl p-5 text-center">
            <Wallet className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Consultancy fee</p>
            <p className="text-lg font-semibold">PKR {Number(country.fee).toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Processing time</p>
            <p className="text-lg font-semibold">{country.processing_days || "Varies"}</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <CheckCircle2 className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Visa types</p>
            <p className="text-lg font-semibold">{country.visa_types?.length ?? 0}</p>
          </div>
        </div>
      </section>

      {country.highlights?.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why <span className="text-gradient-gold">{country.name}</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {country.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {country.visa_types?.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Available <span className="text-gradient-gold">visa types</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {country.visa_types.map((v) => (
                <span key={v} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{v}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Services for <span className="text-gradient-gold">{country.name}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.map((s) => {
                const Icon = iconFor(s.icon);
                return (
                  <Link key={s.id} to={`/services/${s.slug}`} className="group bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all">
                    <Icon className="w-7 h-7 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{s.summary}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 group"
          >
            Apply for {country.name} visa <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CountryDetailPage;
