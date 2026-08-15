import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const socials = [
  { Icon: Facebook, href: "https://www.facebook.com/share/1DZrSsE2MK/", label: "Facebook", color: "#1877F2", hoverBg: "hover:bg-[#1877F2]" },
  { Icon: Instagram, href: "https://www.instagram.com/uzair_consultancy_and_co.5?igsh=MTRsdWV3Y3h2M2RsaA==", label: "Instagram", color: "#E4405F", hoverBg: "hover:bg-[#E4405F]" },
  { Icon: Twitter, href: "https://x.com", label: "Twitter", color: "#1DA1F2", hoverBg: "hover:bg-[#1DA1F2]" },
  { Icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn", color: "#0A66C2", hoverBg: "hover:bg-[#0A66C2]" },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Uzair Visa Consultancy" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <span className="text-lg font-semibold text-gradient-gold block leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Uzair Visa
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Consultancy</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for European visa services. Specializing in Italy, Portugal, Greece & Spain.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, href, label, color, hoverBg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center ${hoverBg} hover:scale-110 transition-all duration-300`}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Study Visa", "Family Reunion", "Work Visa", "Tourist Visa", "Residence Permit"].map((s) => (
                <li key={s}><Link to="/services" className="hover:text-primary transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Countries</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Italy", "Portugal", "Greece", "Spain"].map((c) => (
                <li key={c}><Link to="/destinations" className="hover:text-primary transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/process" className="hover:text-primary transition-colors">Our Process</Link></li>
              <li><Link to="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Uzair Visa Consultancy. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
