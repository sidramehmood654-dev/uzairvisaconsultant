import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="UC" className="h-10 w-10 rounded-full object-cover" />
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
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground" />
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

        <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Uzair Visa Consultancy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
