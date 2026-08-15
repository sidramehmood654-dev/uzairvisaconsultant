import Layout from "@/components/Layout";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Seo from "@/components/Seo";

const TermsPage = () => {
  const { ref, isVisible } = useScrollAnimation();

  const sections = [
    {
      title: "Acceptance of Terms",
      body: "By accessing and using the Uzair Visa Consultancy website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.",
    },
    {
      title: "Services Provided",
      body: "Uzair Visa Consultancy provides consultancy and assistance services for visa applications to Italy, Portugal, Greece, and Spain. We act as a consultant and facilitator; the final decision on any visa application rests solely with the relevant embassy or consulate.",
    },
    {
      title: "No Guarantee of Approval",
      body: "We do not guarantee the approval of any visa application. Visa decisions are made by the respective embassies or consulates based on their own criteria. Our role is to provide guidance, ensure accurate documentation, and maximize the likelihood of a successful application.",
    },
    {
      title: "Client Responsibilities",
      body: "You agree to provide accurate, complete, and truthful information and documentation. You are responsible for the authenticity of all documents submitted. Providing false or misleading information may result in application refusal and termination of our services without refund.",
    },
    {
      title: "Fees and Payments",
      body: "Our consultancy fees are separate from embassy visa fees and third-party charges. All fees must be paid as agreed before services are rendered. Embassy fees and related charges are non-refundable once submitted to the relevant authorities.",
    },
    {
      title: "Refund Policy",
      body: "Consultancy fees are non-refundable once work has commenced on your application. Refunds, where applicable, are addressed in our Refund Policy. If an application is rejected due to client-provided inaccurate information, no refund will be issued.",
    },
    {
      title: "Confidentiality",
      body: "We maintain strict confidentiality of all your personal and application-related information. We will not disclose your information except as required by law or as necessary to process your application.",
    },
    {
      title: "Limitation of Liability",
      body: "Uzair Visa Consultancy shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or the outcome of any visa application. Our total liability is limited to the consultancy fees paid to us.",
    },
    {
      title: "Intellectual Property",
      body: "All content on this website, including text, graphics, logos, and design, is the property of Uzair Visa Consultancy and may not be reproduced or used without our written permission.",
    },
    {
      title: "Changes to Terms",
      body: "We reserve the right to modify these Terms at any time. Updated terms will be posted on this page with the revised date. Continued use of the website after changes constitutes acceptance of the new terms.",
    },
    {
      title: "Contact Us",
      body: "For questions regarding these Terms, contact us at uzairconsultancy@gmail.com or +92 342 6353166, or visit our office at G7 Square Plaza, Sitara Market, Islamabad.",
    },
  ];

  return (
    <Layout>
      <Seo title="Terms of Service | Uzair Visa Consultancy" description="The terms and conditions governing use of Uzair Visa Consultancy services and website." path="/terms" />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl" ref={ref}>
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Legal</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Terms & <span className="text-gradient-gold">Conditions</span>
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: August 14, 2026</p>
          </div>

          <div className="glass-card rounded-xl p-8 md:p-12 space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Please read these Terms and Conditions carefully before using the Uzair Visa Consultancy website and services.
            </p>
            {sections.map((s, i) => (
              <div key={i} className="border-b border-border/50 pb-8 last:border-0 last:pb-0">
                <h2 className="text-xl font-semibold mb-3 text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {i + 1}. {s.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
