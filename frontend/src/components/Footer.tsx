import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { API_BASE_URL } from "@/lib/api";

const Footer = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Footer categories fetch failed", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer>
      {/* Newsletter */}
      <div className="bg-secondary">
        <div className="container mx-auto px-6 lg:px-12 py-16 text-center">
          <h3 className="font-display text-3xl text-foreground mb-3">Stay Wrapped in Luxury</h3>
          <p className="font-body text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Receive updates on new collections, artisan stories, and exclusive offerings.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-accent-foreground font-body text-xs tracking-[0.15em] uppercase font-semibold rounded-md hover:bg-accent/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer - Dark charcoal */}
      <div className="bg-foreground text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <h4 className="font-display text-2xl mb-1">AG Pashmina Pvt ltd </h4>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary-foreground/40 mb-4">Pvt. Ltd.</p>
              <p className="font-body text-xs text-primary-foreground/50 leading-relaxed">
                Authentic Nepali luxury textiles, hand-crafted in the shadow of the Himalayas. Each piece carries centuries of artisan heritage.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-body text-xs tracking-[0.2em] uppercase mb-6 text-primary-foreground/70">
                Quick Links
              </h5>
              <div className="flex flex-col gap-3">
                {[
                  { to: "/shop", label: "Shop All" },
                  { to: "/about", label: "Our Story" },
                  { to: "/education", label: "The Craft" },
                  { to: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="font-body text-sm text-primary-foreground/50 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div>
              <h5 className="font-body text-xs tracking-[0.2em] uppercase mb-6 text-primary-foreground/70">
                Collections
              </h5>
              <div className="flex flex-col gap-3">
                {categories.length > 0 ? (
                  categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${cat.id}`}
                      className="font-body text-sm text-primary-foreground/50 hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link to="/shop?category=Cashmere" className="font-body text-sm text-primary-foreground/50 hover:text-accent transition-colors">Cashmere</Link>
                    <Link to="/shop?category=Pashmina" className="font-body text-sm text-primary-foreground/50 hover:text-accent transition-colors">Pashmina</Link>
                  </>
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-body text-xs tracking-[0.2em] uppercase mb-6 text-primary-foreground/70">
                Contact Info
              </h5>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="mt-1 text-accent shrink-0" strokeWidth={1.5} />
                  <span className="font-body text-sm text-primary-foreground/50">
                    Chhetrapati, Kathmandu, Nepal
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-accent shrink-0" strokeWidth={1.5} />
                  <span className="font-body text-sm text-primary-foreground/50">
                    +977 9843759774
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-accent shrink-0" strokeWidth={1.5} />
                  <span className="font-body text-sm text-primary-foreground/50">
                    agpashmina902@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10">
          <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-[11px] text-primary-foreground/40">
              © 2026 AG Pashmina Pvt. Ltd. All rights reserved.
            </p>
            <p className="font-body text-[11px] text-primary-foreground/40">
              Handcrafted with love in Nepal 🇳🇵
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
