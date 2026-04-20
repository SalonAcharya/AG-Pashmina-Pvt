import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LayoutDashboard, KeyRound, ShoppingBag as OrdersIcon } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, wishlist } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
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
              <div className="relative group">
                <button
                  className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${
                    isTransparent 
                      ? "text-accent-foreground/80 hover:text-accent-foreground hover:bg-white/10" 
                      : "text-foreground hover:text-accent hover:bg-black/5"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  
                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        <OrdersIcon size={14} /> My Orders
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      <OrdersIcon size={14} /> My Orders
                    </Link>
                  )}
                  
                  {user?.hasPassword !== false && (
                    <Link
                      to="/change-password"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      <KeyRound size={14} /> Change Password
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50 pt-3"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
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
                    {isAdmin ? (
                      <>
                        <Link to="/admin" className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3">
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </Link>
                        <Link to="/dashboard" className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3">
                          <OrdersIcon size={16} /> My Orders
                        </Link>
                      </>
                    ) : (
                      <Link to="/dashboard" className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3">
                        <OrdersIcon size={16} /> My Orders
                      </Link>
                    )}
                    {user?.hasPassword !== false && (
                      <Link to="/change-password" className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent flex items-center gap-3">
                        <KeyRound size={16} /> Change Password
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
