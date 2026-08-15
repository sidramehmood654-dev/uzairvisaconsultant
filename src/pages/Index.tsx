import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CountriesSection from "@/components/CountriesSection";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Seo from "@/components/Seo";

const Index = () => {
  return (
    <Layout>
      <Seo title="Uzair Visa Consultancy — Europe Study & Work Visa Experts" description="Expert visa consultancy for Italy, Portugal, Greece and Spain. Study, work, family, tourist and business visa guidance with full application support." path="/" />
      <HeroSection />
      <ServicesSection />
      <CountriesSection />
      <AboutSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
