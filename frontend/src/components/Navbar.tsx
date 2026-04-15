import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, wishlist } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "Our Story" },
    { to: "/education", label: "The Craft" },
    { to: "/contact", label: "Contact" },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md shadow-soft"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className={`font-display text-2xl font-semibold tracking-wide transition-colors duration-500 ${isTransparent ? "text-accent-foreground" : "text-foreground"}`}>
              AG Pashmina
            </span>
            <span className={`text-[10px] font-body tracking-[0.3em] uppercase transition-colors duration-500 ${isTransparent ? "text-accent-foreground/60" : "text-muted-foreground"}`}>
              Pvt. Ltd.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link-gold font-body text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${
                  isTransparent
                    ? location.pathname === link.to ? "text-accent-foreground active" : "text-accent-foreground/80 hover:text-accent-foreground"
                    : location.pathname === link.to ? "text-accent active" : "text-foreground hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link to="/shop" className={`p-2 transition-colors ${isTransparent ? "text-accent-foreground/80 hover:text-accent-foreground" : "hover:text-accent"}`}>
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" className={`p-2 transition-colors relative ${isTransparent ? "text-accent-foreground/80 hover:text-accent-foreground" : "hover:text-accent"}`}>
              <Heart size={18} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-body font-semibold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className={`p-2 transition-colors relative ${isTransparent ? "text-accent-foreground/80 hover:text-accent-foreground" : "hover:text-accent"}`}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-body font-semibold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className={`p-2 transition-colors ${isTransparent ? "text-accent-foreground/80 hover:text-accent-foreground" : "hover:text-accent"}`} title="Dashboard">
                    <LayoutDashboard size={18} strokeWidth={1.5} />
                  </Link>
                )}
                <button
                  onClick={logout}
                  className={`p-2 transition-colors ${isTransparent ? "text-accent-foreground/80 hover:text-accent-foreground" : "hover:text-accent"}`}
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className={`p-2 transition-colors ${isTransparent ? "text-accent-foreground/80 hover:text-accent-foreground" : "hover:text-accent"}`} title="Login">
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}

            <button
              className={`lg:hidden p-2 transition-colors ${isTransparent ? "text-accent-foreground/80" : "hover:text-accent"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border"
          >
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-6">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={logout} className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3 text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3">
                    <User size={16} /> Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
