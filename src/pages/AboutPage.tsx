import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, Clock, Globe, Target, Handshake } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CircularProgress from "@/components/CircularProgress";
import { Award, Shield, Headphones } from "lucide-react";

const values = [
  { icon: Target, title: "Expert Focus", desc: "We exclusively handle European visas for Italy, Portugal, Greece, and Spain — giving us unmatched expertise." },
  { icon: Users, title: "Personalized Approach", desc: "Every client gets a dedicated case officer who understands their unique situation and guides them step by step." },
  { icon: Clock, title: "Timely Processing", desc: "We value your time. Our streamlined processes ensure your application moves forward without unnecessary delays." },
  { icon: Globe, title: "Embassy Knowledge", desc: "Years of experience working with European embassies means we know exactly what they expect." },
  { icon: Handshake, title: "Transparent Pricing", desc: "No hidden charges, no surprise fees. We believe in complete transparency in our pricing structure." },
  { icon: CheckCircle2, title: "End-to-End Support", desc: "From initial consultation to visa approval, we're with you at every stage of the journey." },
];

const AboutPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">About Us</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Trusted <span className="text-gradient-gold">European Visa</span> Partner
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Uzair Visa Consultancy has been helping individuals and families achieve their European dreams. 
              With deep expertise in immigration laws of Italy, Portugal, Greece, and Spain, we provide 
              personalized visa consultation services with a 98% success rate.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                From Humble Beginnings to <span className="text-gradient-gold">1000+ Success Stories</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded with a vision to simplify the complex European visa process, Uzair Visa Consultancy 
                started as a small office dedicated to helping students pursue education abroad. Over the years, 
                we've expanded our services to include family reunion, work permits, residence permits, and 
                business visas.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Today, we are proud to have helped over 1000 clients successfully obtain their European visas. 
                Our team of experienced immigration consultants stays up-to-date with the latest visa regulations 
                and embassy requirements to ensure the highest success rate for our clients.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_-5px_hsl(35_85%_55%_/_0.5)] hover:scale-105 transition-all duration-300"
              >
                Get Free Consultation
              </Link>
            </div>
            <div ref={statsRef} className={`transition-all duration-700 ${statsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <div className="glass-card rounded-xl p-10 glow-gold">
                <div className="grid grid-cols-2 gap-8">
                  <CircularProgress value={100} max={100} label="Visas Approved" displayValue="1000+" icon={<Award className="w-5 h-5" />} delay={0} />
                  <CircularProgress value={4} max={4} label="Countries" displayValue="4" icon={<Globe className="w-5 h-5" />} delay={200} />
                  <CircularProgress value={98} max={100} label="Success Rate" displayValue="98%" icon={<Shield className="w-5 h-5" />} delay={400} />
                  <CircularProgress value={100} max={100} label="24/7 Support" displayValue="24/7" icon={<Headphones className="w-5 h-5" />} delay={600} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4" ref={valuesRef}>
          <div className={`text-center mb-16 transition-all duration-700 ${valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Our Values</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why <span className="text-gradient-gold">Choose Us</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`group bg-card border border-border rounded-xl p-8 hover:border-primary/40 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(35_85%_55%_/_0.15)] transition-all duration-700 ${
                  valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
