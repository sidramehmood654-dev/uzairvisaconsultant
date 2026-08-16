import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import { getServiceBySlug } from "@/lib/services";
import { listEnabledCountries } from "@/lib/countries";
import { imageFor, iconFor } from "@/lib/media";

const ServiceDetailPage = () => {
  const { slug = "" } = useParams();
  const { data: service, isLoading } = useQuery({ queryKey: ["service", slug], queryFn: () => getServiceBySlug(slug) });
  const { data: countries } = useQuery({ queryKey: ["countries", "enabled"], queryFn: listEnabledCountries });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">Loading service…</div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <Seo title="Service not found | Uzair Visa Consultancy" description="This service is not available." path={`/services/${slug}`} />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Service not found</h1>
          <Link to="/services" className="text-primary hover:underline">Back to all services</Link>
        </div>
      </Layout>
    );
  }

  const Icon = iconFor(service.icon);
  const linkedCountries = (countries ?? []).filter((c) => service.countries?.includes(c.name));

  return (
    <Layout>
      <Seo
        title={`${service.title} | Uzair Visa Consultancy`}
        description={service.summary || `${service.title} guidance, documentation and filing support with Uzair Visa Consultancy.`}
        path={`/services/${service.slug}`}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> All services
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {service.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">{service.description || service.summary}</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 group"
              >
                Start your application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden border border-border glow-gold">
              <img src={imageFor(service.image_key, service.slug)} alt={service.title} className="w-full h-80 object-cover" width={800} height={600} />
            </div>
          </div>
        </div>
      </section>

      {service.features?.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              What's <span className="text-gradient-gold">included</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.features.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {linkedCountries.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Available <span className="text-gradient-gold">destinations</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {linkedCountries.map((c) => (
                <Link key={c.id} to={`/destinations/${c.slug}`} className="group rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:-translate-y-1">
                  <img src={imageFor(c.image_key, c.slug)} alt={c.name} className="w-full h-32 object-cover" loading="lazy" width={400} height={300} />
                  <div className="p-4 bg-card">
                    <p className="font-semibold">{c.flag} {c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.processing_days || "Processing varies"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ServiceDetailPage;
