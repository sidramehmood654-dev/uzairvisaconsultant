import Layout from "@/components/Layout";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PrivacyPage = () => {
  const { ref, isVisible } = useScrollAnimation();

  const sections = [
    {
      title: "Information We Collect",
      body: "We collect information you provide directly to us, such as your name, email address, phone number, passport details, and visa application details when you fill out a form, create an account, or contact us. We also collect information automatically such as browser type, IP address, and usage data through cookies and similar technologies.",
    },
    {
      title: "How We Use Your Information",
      body: "We use your personal information to process visa applications, communicate with you about your enquiry or application, verify your identity and documents, send you notifications and updates regarding your case, comply with legal obligations, and improve our services and website functionality.",
    },
    {
      title: "Sharing Your Information",
      body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with relevant embassies, consulates, and government authorities as required to process your visa application, with trusted service providers who assist us in operating our business (under confidentiality agreements), and when required by law or to protect our rights.",
    },
    {
      title: "Data Security",
      body: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission, access controls, and regular security reviews.",
    },
    {
      title: "Data Retention",
      body: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Application-related data is retained for the duration of your application process and a reasonable period thereafter for record-keeping purposes.",
    },
    {
      title: "Your Rights",
      body: "You have the right to access, correct, or delete your personal information, object to or restrict certain processing, withdraw consent for data processing, and receive a copy of your personal data in a structured, portable format. To exercise these rights, contact us using the details below.",
    },
    {
      title: "Cookies",
      body: "Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze how the site is used. You can control cookies through your browser settings, but disabling them may affect website functionality.",
    },
    {
      title: "Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
    },
    {
      title: "Contact Us",
      body: "If you have any questions about this Privacy Policy, please contact us at uzairconsultancy@gmail.com or +92 342 6353166, or visit our office at G7 Square Plaza, Sitara Market, Islamabad.",
    },
  ];

  return (
    <Layout>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl" ref={ref}>
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs uppercase tracking-widest text-primary">Legal</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Privacy <span className="text-gradient-gold">Policy</span>
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: August 14, 2026</p>
          </div>

          <div className="glass-card rounded-xl p-8 md:p-12 space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Uzair Visa Consultancy ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.
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

export default PrivacyPage;
