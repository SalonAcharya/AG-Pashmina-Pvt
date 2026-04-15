import { FadeInUp } from "@/components/FadeInUp";
import cashmereTexture from "@/assets/cashmere-texture.jpg";
import pashminaShawl from "@/assets/pashmina-shawl.jpg";
import yakWool from "@/assets/yak-wool.jpg";

const Education = () => {
  const fibers = [
    {
      name: "Cashmere",
      image: cashmereTexture,
      origin: "High-altitude Himalayan goats (above 4,000m)",
      fiber: "14-19 microns",
      warmth: "3x warmer than sheep wool",
      description: "Cashmere comes from the soft undercoat of the Changthangi and other Himalayan goat breeds. During harsh winters, goats develop an incredibly fine undercoat for insulation. In spring, this down is harvested by gentle combing. The fibers are then sorted, cleaned, and spun into yarn by skilled artisans. Premium cashmere is distinguished by its fineness, length, and uniformity — characteristics directly influenced by the altitude and climate where the goats graze.",
      value: "Cashmere's value lies in its rarity — each goat produces only 150-200 grams of usable fiber per year. This scarcity, combined with the labor-intensive process of sorting and spinning, makes genuine cashmere one of the world's most precious natural textiles.",
    },
    {
      name: "Pashmina",
      image: pashminaShawl,
      origin: "Changthangi goats of the Himalayan plateau",
      fiber: "12-15 microns (the finest)",
      warmth: "The warmest and lightest natural fiber",
      description: "Pashmina is the finest grade of cashmere, derived exclusively from the Changthangi goat found at altitudes above 4,500 meters. The word 'Pashmina' comes from the Persian word 'Pashm' meaning 'wool.' The fibers are so fine that a genuine pashmina shawl can be passed through a wedding ring — a traditional test of authenticity. Nepali artisans hand-spin pashmina on traditional spinning wheels (charkha) and weave it on handlooms, creating textiles of extraordinary lightness and warmth.",
      value: "True pashmina is among the rarest textiles in the world. A single shawl can take two to three weeks to weave by hand. The combination of extreme rarity, painstaking craftsmanship, and unmatched quality makes pashmina a treasured heirloom.",
    },
    {
      name: "Yak Wool",
      image: yakWool,
      origin: "Himalayan yaks (above 3,000m)",
      fiber: "16-20 microns",
      warmth: "Naturally water-resistant and insulating",
      description: "Yak wool comes from the dense undercoat of the Himalayan yak, an animal perfectly adapted to the extreme cold of high-altitude life. The down fiber, collected during the annual spring molt, is softer than camel hair and warmer than merino wool. Yak wool retains natural oils that provide water resistance, making it ideal for the unpredictable mountain climate. Traditional Nepali communities have relied on yak fiber for clothing, shelter, and trade for millennia.",
      value: "Yak wool is gaining recognition as a sustainable luxury fiber. Unlike cashmere goats, yaks are gentle on their environment, causing minimal grazing damage. This makes yak wool an eco-conscious choice that supports both traditional communities and environmental preservation.",
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">The Craft</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">Know Your Fiber</h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Understanding the origin, character, and craftsmanship behind each fiber helps you choose the perfect piece — and appreciate the heritage woven into every thread.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-24 pb-24">
          {fibers.map((fiber, i) => (
            <FadeInUp key={fiber.name}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    <img src={fiber.image} alt={fiber.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">{fiber.name}</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Origin</p>
                      <p className="font-body text-xs text-foreground">{fiber.origin}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Fiber</p>
                      <p className="font-body text-xs text-foreground">{fiber.fiber}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Warmth</p>
                      <p className="font-body text-xs text-foreground">{fiber.warmth}</p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{fiber.description}</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed italic">{fiber.value}</p>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
