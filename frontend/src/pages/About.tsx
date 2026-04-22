import { FadeInUp } from "@/components/FadeInUp";
import artisanWeaving from "@/assets/artisan-weaving.jpg";
import cashmereTexture from "@/assets/cashmere-texture.jpg";
import yakWool from "@/assets/yak-wool.jpg";
import founderPhoto from "@/assets/founder-saroj.jpg";
import SEO from "@/components/SEO";

const milestones = [
  { year: "2010", label: "Started in the textile industry" },
  { year: "2016", label: "Opened first shop in Thamel" },
  { year: "2020", label: "Founded AG Pashmina Pvt. Ltd." },
  { year: "2023", label: "Expanded to second location" },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Our Story & Himalayan Heritage"
        description="Discover the legacy of AG Pashmina. Three generations of handcrafted Himalayan textiles, supporting Nepali artisans and sourcing the finest sustainable cashmere."
      />
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={artisanWeaving} 
            alt="Nepali Artisan weaving Pashmina on a traditional wooden loom" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <FadeInUp>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-foreground/70 mb-4">Our Story</p>
            <h1 className="font-display text-5xl md:text-6xl font-light text-accent-foreground">
              A Legacy of Craft
            </h1>
          </FadeInUp>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Who We Are</p>
              <h2 className="font-display text-4xl font-light text-foreground mb-8">AG Pashmina Pvt. Ltd.</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                Founded in the heart of Nepal, AG Pashmina is dedicated to bringing the world the finest Himalayan textiles. Our journey began with a simple belief: that the extraordinary fibers found at the roof of the world deserve to be crafted with equal care and shared with those who appreciate true quality.
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                We work directly with herding communities across the high Himalayan plateaus, sourcing only the finest cashmere, pashmina, and yak wool. Each fiber is then entrusted to our network of master artisans — weavers, dyers, and embroiderers who carry forward techniques perfected over centuries.
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Every AG Pashmina piece is more than a textile — it is a bridge between ancient Nepali traditions and the modern world.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-card">
                <img 
                  src={founderPhoto} 
                  alt="Saroj Acharya — Founder & CEO of AG Pashmina" 
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
              </div>
              <div className="border-l-2 border-accent/30 pl-8">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Meet the Founder</p>
                <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">
                  Saroj Acharya
                </h2>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">Founder & CEO</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  With over a decade of experience in the pashmina and textile industry, Saroj Acharya built AG Pashmina from the ground up. He started from humble beginnings — working under others, learning every thread of the craft from sourcing raw fibers to understanding what customers truly value.
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  Through years of dedication, he built deep relationships with artisans and customers alike. Today, he owns two shops in Thamel, the heart of Kathmandu's tourist and craft district, where he personally connects with customers from around the world.
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed italic">
                  His philosophy is simple: every piece that leaves AG Pashmina should carry the warmth of the Himalayas and the honesty of the hands that made it.
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeInUp>
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Journey</p>
              <h2 className="font-display text-3xl font-light text-foreground">Milestones</h2>
            </div>
          </FadeInUp>
          <div className="relative max-w-4xl mx-auto">
            {/* Horizontal line */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-accent/30" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {milestones.map((m, i) => (
                <FadeInUp key={m.year} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="font-display text-sm font-semibold text-accent">{m.year}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{m.label}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInUp>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={cashmereTexture} 
                    alt="Close up of soft Himalayan Cashmere texture" 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden mt-8">
                  <img 
                    src={yakWool} 
                    alt="Authentic Himalayan Yak Wool fibers" 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </div>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.15}>
              <div>
                <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Values</p>
                <h2 className="font-display text-3xl font-light text-foreground mb-8">Rooted in Heritage</h2>
                {[
                  { title: "Authenticity", desc: "Every product is genuinely Nepali, sourced and crafted in the Himalayan region." },
                  { title: "Sustainability", desc: "We partner with herding communities practicing ethical and sustainable animal husbandry." },
                  { title: "Fair Trade", desc: "Our artisans receive fair wages and work in safe, respectful conditions." },
                  { title: "Quality First", desc: "Rigorous quality standards ensure each piece meets the highest benchmarks of luxury." },
                ].map((value) => (
                  <div key={value.title} className="mb-6">
                    <h3 className="font-display text-xl text-foreground mb-1">{value.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
