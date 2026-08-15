import Layout from "@/components/Layout";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "@/hooks/use-toast";
import { createEnquiry } from "@/lib/enquiries";
import Seo from "@/components/Seo";


const visaTypesByCountry: Record<string, string[]> = {
  Italy: ["Study Visa", "Family Reunion Visa", "Work Visa", "Tourist / Visit Visa", "Residence Permit", "Business / Investor Visa"],
  Portugal: ["Study Visa", "Family Reunion Visa", "Work Visa", "Tourist / Visit Visa", "Golden Visa", "D7 Passive Income Visa"],
  Greece: ["Study Visa", "Family Reunion Visa", "Work Visa", "Tourist / Visit Visa", "Residence Permit", "Golden Visa"],
  Spain: ["Study Visa", "Family Reunion Visa", "Work Visa", "Tourist / Visit Visa", "Non-Lucrative Visa", "Digital Nomad Visa"],
};

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", visa: "", country: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const availableVisaTypes = formData.country ? visaTypesByCountry[formData.country] || [] : [];

  const handleCountryChange = (country: string) => {
    setFormData({ ...formData, country, visa: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        visa_type: formData.visa,
        message: formData.message,
      });
      toast({ title: "Thank you!", description: "Your enquiry has been received. We will contact you soon." });
      setFormData({ name: "", email: "", phone: "", visa: "", country: "", message: "" });
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message ?? err?.message ?? "Please try again.";
      toast({ title: "Could not send enquiry", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Layout>
      <Seo title="Contact Us | Uzair Visa Consultancy" description="Get in touch for a free visa consultation. Call, WhatsApp or send an enquiry and our advisors will respond quickly." path="/contact" />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10" ref={ref}>
          <div className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Contact Us</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Book Your <span className="text-gradient-gold">Free</span> Consultation
            </h1>
            <p className="text-lg text-muted-foreground">
              Get in touch with our visa experts today. We offer free initial consultations to assess your eligibility and guide you on the best visa pathway.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            <div className={`lg:col-span-2 space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              {[
                { icon: MapPin, label: "Visit Us", value: "G7 Square Plaza,\nSitara Market, Islamabad" },
                { icon: Phone, label: "Call Us", value: "+92 342 6353166" },
                { icon: Mail, label: "Email Us", value: "uzairconsultancy@gmail.com" },
                { icon: Clock, label: "Working Hours", value: "Mon – Sat: 9:00 AM – 7:00 PM" },
                { icon: MessageCircle, label: "WhatsApp", value: "+92 342 6353166" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex gap-4 group transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{item.label}</div>
                    <div className="text-muted-foreground text-sm whitespace-pre-line">{item.value}</div>
                  </div>
                </div>
              ))}

              <div className="glass-card rounded-xl p-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Visit our office for in-person consultation</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`lg:col-span-3 glass-card rounded-xl p-8 space-y-5 glow-gold transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
            >
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Send Us a Message
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="tel" placeholder="Phone / WhatsApp" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                <select value={formData.country} onChange={(e) => handleCountryChange(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                  <option value="">Select Destination Country</option>
                  <option>Italy</option>
                  <option>Portugal</option>
                  <option>Greece</option>
                  <option>Spain</option>
                </select>
              </div>
              <select value={formData.visa} onChange={(e) => setFormData({ ...formData, visa: e.target.value })} disabled={!formData.country} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">{formData.country ? "Select Visa Type" : "Select a country first"}</option>
                {availableVisaTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <textarea placeholder="Tell us about your requirements..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all" />
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_-5px_hsl(35_85%_55%_/_0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                No account needed — our team will reply to your email.
              </p>

            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
