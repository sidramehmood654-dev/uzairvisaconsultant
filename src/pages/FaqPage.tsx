import Layout from "@/components/Layout";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Seo from "@/components/Seo";

const faqs = [
  {
    category: "General",
    q: "Which countries do you provide visa consultancy for?",
    a: "We specialize in visa services for Italy, Portugal, Greece, and Spain. We handle Study, Family Reunion, Work, Tourist/Visit, Residence, and Business/Investor visas for these destinations.",
  },
  {
    category: "General",
    q: "Do you guarantee visa approval?",
    a: "No consultant can guarantee visa approval, as the final decision rests with the respective embassy or consulate. However, our expertise ensures your application is accurate, complete, and presented in the best possible way to maximize your chances.",
  },
  {
    category: "General",
    q: "Where is your office located?",
    a: "Our office is at G7 Square Plaza, Sitara Market, Islamabad. We are open Monday to Saturday, 9:00 AM to 7:00 PM. You can also reach us via WhatsApp at +92 342 6353166.",
  },
  {
    category: "Application Process",
    q: "How long does the visa application process take?",
    a: "Processing times vary by country and visa type, typically ranging from 2 to 12 weeks. Study visas may take longer during peak seasons. We provide an estimated timeline at the start of your application based on current embassy processing times.",
  },
  {
    category: "Application Process",
    q: "What documents do I need for a visa application?",
    a: "Required documents vary by visa type and destination. Generally, you will need a valid passport, photographs, proof of accommodation, financial statements, and visa-type-specific documents (e.g., university acceptance letter for study visas, job offer for work visas). We provide a complete checklist during your consultation.",
  },
  {
    category: "Application Process",
    q: "Can I apply for a visa without visiting your office?",
    a: "Yes. You can submit your application and documents online through our client portal. However, we recommend an initial consultation (in-person or via WhatsApp) to ensure your application is correctly prepared.",
  },
  {
    category: "Fees & Payments",
    q: "How much does your consultancy service cost?",
    a: "Our consultancy fees vary depending on the visa type and complexity of the case. Embassy visa fees and third-party charges (translation, courier, medical) are separate. Contact us for a personalized quote based on your requirements.",
  },
  {
    category: "Fees & Payments",
    q: "Are the fees refundable if my visa is rejected?",
    a: "Consultancy fees are generally non-refundable once work has commenced. Embassy fees are non-refundable once submitted. Please review our Refund Policy for full details on refundable situations.",
  },
  {
    category: "Client Portal",
    q: "How do I track the status of my application?",
    a: "Once you create an account and submit an application, you can track its status in real time through our client portal at any time. You will also receive updates as your application progresses.",
  },
  {
    category: "Client Portal",
    q: "Do I need an account to submit an enquiry?",
    a: "No, you can send a contact enquiry without creating an account. However, to formally submit a visa application and track its progress, you will need to create a free account.",
  },
  {
    category: "Client Portal",
    q: "How do I upload my documents?",
    a: "After logging into your client portal, navigate to the Documents section. You can securely upload files up to 10MB each. Our team verifies each document and notifies you if any additional information is needed.",
  },
  {
    category: "Staff & Admin",
    q: "How do staff and admins access the portal?",
    a: "Staff and admins log in through the /admin route. Access is role-based — staff handle assigned cases and document verification, while admins manage the entire system including applications, staff, countries, and payments.",
  },
];

const FaqPage = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <Layout>
      <Seo title="Visa FAQs | Uzair Visa Consultancy" description="Answers to common questions about visa requirements, documents, processing times, fees and refunds." path="/faq" />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl" ref={ref}>
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Help Center</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our visa services, application process, fees, and client portal.
            </p>
          </div>

          {categories.map((cat) => (
            <div key={cat} className="mb-10">
              <h2 className="text-sm uppercase tracking-widest text-primary mb-4">{cat}</h2>
              <div className="space-y-3">
                {faqs.filter((f) => f.category === cat).map((faq, i) => {
                  const idx = faqs.indexOf(faq);
                  const open = openIndex === idx;
                  return (
                    <div key={i} className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${open ? "glow-gold" : ""}`}>
                      <button
                        onClick={() => setOpenIndex(open ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      >
                        <span className="font-semibold text-foreground text-sm md:text-base">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="glass-card rounded-xl p-8 text-center mt-12">
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Still have questions?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">Our visa experts are ready to help you with a free consultation.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/923426353166" target="_blank" rel="noopener noreferrer" className="bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                Chat on WhatsApp
              </a>
              <a href="/contact" className="border border-primary/40 text-primary px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/10 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FaqPage;
