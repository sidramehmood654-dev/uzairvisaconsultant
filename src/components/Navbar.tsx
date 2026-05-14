import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Sun, Moon, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem("uvc_user") === "1");
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("uvc_user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Destinations", href: "/destinations" },
    { label: "About", href: "/about" },
    { label: "Process", href: "/process" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo + Nav Links together */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Uzair Visa Consultancy" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-primary/30" />
            <div className="hidden sm:block">
              <span className="text-lg font-semibold text-gradient-gold block leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Uzair Visa
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Consultancy</span>
            </div>
          </Link>

          {/* Desktop nav links next to logo */}
          <div className="hidden md:flex items-center gap-4 lg:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-[11px] lg:text-xs tracking-wide uppercase transition-colors duration-300 relative group ${
                  location.pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/client/dashboard"
                className="flex items-center gap-1.5 text-xs border border-primary/40 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> My Portal
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 text-xs border border-primary/40 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </Link>
            </>
          )}

          <a
            href="tel:03135031850"
            className="flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 uppercase text-sm tracking-wide transition-colors ${
                  location.pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/client/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 border border-primary/40 bg-primary/10 text-primary px-5 py-3 rounded-lg text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> My Portal
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center justify-center gap-2 border border-border text-muted-foreground px-5 py-3 rounded-lg text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 border border-border text-foreground px-3 py-2.5 rounded-lg text-sm"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 border border-primary/40 bg-primary/10 text-primary px-3 py-2.5 rounded-lg text-sm"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}
            <a
              href="tel:03135031850"
              className="flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground px-5 py-3 rounded-lg text-sm font-semibold"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
