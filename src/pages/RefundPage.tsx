import Layout from "@/components/Layout";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Seo from "@/components/Seo";

const RefundPage = () => {
  const { ref, isVisible } = useScrollAnimation();

  const sections = [
    {
      title: "Consultancy Fees",
      body: "Our consultancy fees cover the professional guidance, document review, and application assistance we provide. These fees are separate from embassy visa fees and third-party charges such as translation, courier, or medical examination costs.",
    },
    {
      title: "Non-Refundable Situations",
      body: "Consultancy fees are non-refundable in the following cases: once work has commenced on your application, if the application is rejected due to inaccurate or incomplete information provided by the client, if the client withdraws the application voluntarily, or if the client fails to attend embassy appointments or interviews.",
    },
    {
      title: "Refundable Situations",
      body: "A refund of consultancy fees may be considered if we fail to commence any work on your application after full payment, or if a significant error on our part directly causes the application to be rejected. Refund requests must be made in writing within 30 days of the relevant event.",
    },
    {
      title: "Embassy and Third-Party Fees",
      body: "Visa application fees paid to embassies or consulates, and fees paid to third-party service providers (translators, couriers, medical centers), are non-refundable once submitted, regardless of the application outcome.",
    },
    {
      title: "Refund Process",
      body: "Approved refunds will be processed within 14 business days to the original payment method. Partial refunds, where applicable, will be calculated based on the work completed at the time of the refund request.",
    },
    {
      title: "Document and Processing Charges",
      body: "Any charges incurred for document preparation, translation, or courier services are non-refundable once the service has been rendered, as these costs are paid to external providers.",
    },
    {
      title: "How to Request a Refund",
      body: "To request a refund, contact us at uzairconsultancy@gmail.com with your full name, application reference number, and a detailed explanation. Each request is reviewed on a case-by-case basis.",
    },
    {
      title: "Changes to This Policy",
      body: "We reserve the right to update this Refund Policy at any time. Changes will be posted on this page with an updated date.",
    },
  ];

  return (
    <Layout>
      <Seo title="Refund Policy | Uzair Visa Consultancy" description="Our refund and cancellation policy for consultancy fees and visa application services." path="/refund" />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl" ref={ref}>
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Legal</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Refund & <span className="text-gradient-gold">Cancellation</span> Policy
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: August 14, 2026</p>
          </div>

          <div className="glass-card rounded-xl p-8 md:p-12 space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              This Refund and Cancellation Policy outlines the terms under which refunds may be issued for services provided by Uzair Visa Consultancy.
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

export default RefundPage;
