import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Star, Shield, Gem, Package, ChevronRight, ChevronDown } from "lucide-react";
import heroBright from "@/assets/hero-bright.jpg";
import cashmereTexture from "@/assets/cashmere-texture.jpg";
import pashminaShawl from "@/assets/pashmina-shawl.jpg";
import yakWool from "@/assets/yak-wool.jpg";
import heroMountains from "@/assets/hero-mountains.jpg";

const Index = () => {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBright}
            alt="Himalayan mountains at golden hour with yaks grazing"
            className="w-full h-full object-cover animate-kenburns"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/10 to-foreground/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <FadeInUp>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-foreground/80 mb-6">
              Handcrafted in Nepal
            </p>
          </FadeInUp>
          <FadeInUp delay={0.15}>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-accent-foreground mb-4 leading-[0.95]">
              AG Pashmina
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <p className="font-display text-lg md:text-xl text-accent-foreground/85 italic mb-10 max-w-lg mx-auto">
              Luxury woven from the soul of the Himalayas
            </p>
          </FadeInUp>
          <FadeInUp delay={0.45}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <button className="px-8 py-3.5 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-semibold rounded-md hover:shadow-lift transition-all duration-300">
                  Shop Now
                </button>
              </Link>
              <Link to="/education">
                <button className="px-8 py-3.5 border border-accent-foreground/50 text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-semibold rounded-md hover:bg-accent-foreground/10 transition-all duration-300">
                  Explore the Craft
                </button>
              </Link>
            </div>
          </FadeInUp>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-accent-foreground/60" strokeWidth={1} />
        </div>
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
      </section>

      {/* Woven with Heritage */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <FadeInUp>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Legacy</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              Three generations of Himalayan craft
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
              For over three generations, AG Pashmina has woven the finest Himalayan fibers into textiles that carry the warmth of Nepal's spirit. From the high-altitude pastures where cashmere goats graze to the skilled looms of Kathmandu Valley, our craft is a living legacy.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              Every piece we create honors the artisan hands that shaped it and the ancient land that inspired it.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 font-body text-sm tracking-[0.05em] text-accent hover:text-accent/80 transition-colors font-semibold">
              Read Our Story <ChevronRight size={16} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Collections</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">Featured Collections</h2>
            </div>
          </FadeInUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Cashmere Shawls", image: cashmereTexture, link: "/shop?category=Cashmere" },
              { title: "Embroidered Stoles", image: pashminaShawl, link: "/shop?category=Pashmina" },
              { title: "Ring Pashmina", image: yakWool, link: "/shop?category=Yak+Wool" },
            ].map((item, i) => (
              <FadeInUp key={item.title} delay={i * 0.1}>
                <Link to={item.link} className="group relative block overflow-hidden rounded-lg aspect-[3/4]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent group-hover:from-foreground/50 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-display text-2xl text-accent-foreground">{item.title}</h3>
                  </div>
                </Link>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* The Craft Process */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">The Process</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">From Fiber to Fabric</h2>
            </div>
          </FadeInUp>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-accent/30" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Sourcing", desc: "Raw fibers combed from high-altitude goats and yaks across the Himalayas." },
                { step: "02", title: "Spinning", desc: "Hand-spun on traditional charkha wheels by skilled artisans." },
                { step: "03", title: "Weaving", desc: "Woven on handlooms using techniques perfected over centuries." },
                { step: "04", title: "Finishing", desc: "Washed, brushed, and quality-checked for the perfect luxurious feel." },
              ].map((item, i) => (
                <FadeInUp key={item.step} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center mx-auto mb-5 relative z-10">
                      <span className="font-display text-lg font-semibold text-accent">{item.step}</span>
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial - Parallax */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMountains} alt="Himalayan mountains" className="w-full h-full object-cover" loading="lazy" style={{ transform: 'scale(1.1)' }} />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <FadeInUp>
            <p className="font-display text-2xl md:text-3xl italic text-accent-foreground/90 leading-relaxed mb-8">
              "The quality is extraordinary. My cashmere shawl from AG Pashmina is the softest thing I've ever owned. You can truly feel the Himalayan heritage in every thread."
            </p>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent-foreground/60">
              Sarah M. — London, UK
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* From Our Collection */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
              <div>
                <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Curated Selection</p>
                <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">From Our Collection</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-accent/80 transition-colors font-semibold">
                View All Products <ChevronRight size={14} />
              </Link>
            </div>
          </FadeInUp>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Promise</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">Why AG Pashmina</h2>
            </div>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Gem, title: "Authentic Origin", desc: "Every fiber traced back to its Himalayan source." },
              { icon: Shield, title: "Quality Assured", desc: "Rigorous quality checks at every stage." },
              { icon: Star, title: "Artisan Crafted", desc: "Hand-woven by master artisans." },
              { icon: Package, title: "Luxury Packaging", desc: "Premium packaging, ready for gifting." },
            ].map((item, i) => (
              <FadeInUp key={item.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mx-auto mb-5 shadow-soft">
                    <item.icon size={22} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
