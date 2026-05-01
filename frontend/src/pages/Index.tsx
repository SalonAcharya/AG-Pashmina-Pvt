import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FadeInUp } from "@/components/FadeInUp";
import ProductCard from "@/components/ProductCard";
import { Star, Shield, Gem, Package, ChevronRight, ChevronDown } from "lucide-react";
import heroBright from "@/assets/hero-bright.jpg";
import heroMountains from "@/assets/hero-mountains.jpg";
import SEO from "@/components/SEO";

const API_BASE_URL = "https://ag-pashmina-pvt.onrender.com";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/categories`)
        ]);
        const prodData = await prodRes.json();
        const catsData = await catsRes.json();
        setFeaturedProducts(Array.isArray(prodData) ? prodData.slice(0, 8) : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch (err) {
        console.error("Home data fetch failed", err);
      }
    };
    fetchData();
  }, []);

  const getImg = (url: string) => url?.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AG Pashmina",
    "url": "https://www.agpashmina.com.np",
    "logo": "https://www.agpashmina.com.np/favicon.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-1-4700000",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.facebook.com/agpashmina",
      "https://www.instagram.com/agpashmina"
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="AG Pashmina | Authentic Himalayan Cashmere & Pashmina from Nepal"
        description="Luxury Pashmina, Cashmere, and Yak wool shawls handcrafted by master artisans in Nepal. Experience the warmth and heritage of the Himalayas."
        schema={organizationSchema}
      />
      
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroBright} 
            alt="Handcrafted Luxury AG Pashmina Collection in Nepal" 
            className="w-full h-full object-cover animate-kenburns" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/10 to-foreground/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <FadeInUp><p className="font-body text-xs tracking-[0.4em] uppercase text-accent-foreground/80 mb-6">Handcrafted in Nepal</p></FadeInUp>
          <FadeInUp delay={0.15}><h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-accent-foreground mb-4 leading-[0.95]">AG Pashmina</h1></FadeInUp>
          <FadeInUp delay={0.3}><p className="font-display text-lg md:text-xl text-accent-foreground/85 italic mb-10 max-w-lg mx-auto">Luxury woven from the soul of the Himalayas</p></FadeInUp>
          <FadeInUp delay={0.45}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop"><button className="px-8 py-3.5 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-semibold rounded-md hover:shadow-lift transition-all">Shop Now</button></Link>
              <Link to="/education"><button className="px-8 py-3.5 border border-accent-foreground/50 text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-semibold rounded-md hover:bg-accent-foreground/10 transition-all">Explore the Craft</button></Link>
            </div>
          </FadeInUp>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown className="text-accent-foreground/60" strokeWidth={1} /></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Legacy */}
      <section className="py-24 text-center container mx-auto px-6 max-w-3xl">
        <FadeInUp>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Legacy</p>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">Three generations of Himalayan craft</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">For over three generations, AG Pashmina has woven the finest Himalayan fibers into textiles that carry the warmth of Nepal's spirit...</p>
          <Link to="/about" className="inline-flex items-center gap-2 font-body text-sm text-accent font-semibold">Read Our Story <ChevronRight size={16} /></Link>
        </FadeInUp>
      </section>

      {/* Featured Collections — infinite marquee */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Collections</p>
              <h2 className="font-display text-4xl font-light">Featured Collections</h2>
            </div>
          </FadeInUp>
        </div>
        {categories.length > 0 && (() => {
          // Repeat enough times so the marquee never shows empty space
          const minItems = 12;
          const repeats = Math.ceil(minItems / categories.length);
          const loopCats = Array.from({ length: repeats * 2 }, (_, r) =>
            categories.map((cat: any, i: number) => ({ ...cat, _key: `${r}-${i}` }))
          ).flat();
          return (
            <div className="overflow-hidden">
              <div className="marquee-track flex gap-6 w-max">
                {loopCats.map((cat: any) => (
                  <Link
                    key={cat._key}
                    to={`/shop?category=${cat.id}`}
                    className="group relative flex-shrink-0 w-64 h-80 rounded-lg overflow-hidden block"
                  >
                    <img
                      src={getImg(cat.image)}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent-foreground/60 mb-1">Collection</p>
                      <h3 className="font-display text-xl text-accent-foreground">{cat.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* From Our Collection */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <FadeInUp>
            <div className="flex justify-between items-end mb-16">
              <div><p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Curated Selection</p><h2 className="font-display text-4xl md:text-5xl font-light">From Our Collection</h2></div>
              <Link to="/shop" className="text-accent flex items-center gap-2 text-xs font-semibold uppercase">View All <ChevronRight size={14} /></Link>
            </div>
          </FadeInUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative py-32 overflow-hidden bg-foreground/60 text-center text-accent-foreground">
        <div className="absolute inset-0 -z-10"><img src={heroMountains} className="w-full h-full object-cover opacity-40" /></div>
        <div className="container mx-auto px-6 max-w-2xl">
          <FadeInUp><p className="font-display text-2xl italic mb-8">"The quality is extraordinary. My cashmere shawl from AG Pashmina is the softest thing I've ever owned."</p><p className="font-body text-xs tracking-widest uppercase opacity-60">Sarah M. — London, UK</p></FadeInUp>
        </div>
      </section>
    </div>
  );
};

export default Index;
