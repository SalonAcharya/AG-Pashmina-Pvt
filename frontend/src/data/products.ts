import cashmereClassicCream from "@/assets/products/cashmere-classic-cream.jpg";
import cashmereCharcoal from "@/assets/products/cashmere-charcoal.jpg";
import cashmereCamel from "@/assets/products/cashmere-camel.jpg";
import pashminaRose from "@/assets/products/pashmina-rose.jpg";
import pashminaBurgundy from "@/assets/products/pashmina-burgundy.jpg";
import pashminaIvory from "@/assets/products/pashmina-ivory.jpg";
import pashminaNavy from "@/assets/products/pashmina-navy.jpg";
import yakNaturalBrown from "@/assets/products/yak-natural-brown.jpg";
import yakGrey from "@/assets/products/yak-grey.jpg";
import yakHerringbone from "@/assets/products/yak-herringbone.jpg";

export type Category = "Cashmere" | "Pashmina" | "Yak Wool" | "Fine Wool" | "Modal Silk";

export interface Product {
  id: string;
  name: string;
  category: Category;
  category_name?: string;
  price: number;
  sale_price?: number;
  base_price?: number;
  rating: number;
  description: string;
  shortDescription?: string;
  material?: string;
  origin?: string;
  image?: string;
  images: string[];
  inStock?: boolean;
  stock_quantity?: number;
  sizes?: string[];
  colors?: string[];
}

export const products: Product[] = [
  {
    id: "cashmere-classic-cream",
    name: "Classic Cream Cashmere Shawl",
    category: "Cashmere",
    price: 285,
    rating: 4.9,
    description: "Hand-woven from the finest Himalayan cashmere, this classic cream shawl embodies timeless elegance. Each piece is carefully crafted by skilled Nepali artisans using traditional techniques passed down through generations.",
    shortDescription: "Ultra-soft hand-woven Himalayan cashmere in timeless cream",
    material: "100% Grade A Cashmere",
    origin: "Kathmandu Valley, Nepal",
    image: cashmereClassicCream,
    images: [cashmereClassicCream],
    inStock: true,
  },
  {
    id: "cashmere-charcoal",
    name: "Charcoal Cashmere Wrap",
    category: "Cashmere",
    price: 310,
    rating: 4.8,
    description: "A sophisticated charcoal cashmere wrap that transitions effortlessly from day to evening.",
    shortDescription: "Sophisticated deep charcoal wrap in pure cashmere",
    material: "100% Grade A Cashmere",
    origin: "Kathmandu Valley, Nepal",
    image: cashmereCharcoal,
    images: [cashmereCharcoal],
    inStock: true,
  },
  {
    id: "cashmere-camel",
    name: "Camel Cashmere Stole",
    category: "Cashmere",
    price: 265,
    rating: 4.7,
    description: "Inspired by the warm golden hues of the Himalayan foothills, this camel cashmere stole is the perfect everyday luxury.",
    shortDescription: "Warm golden camel tones in premium cashmere",
    material: "100% Grade A Cashmere",
    origin: "Kathmandu Valley, Nepal",
    image: cashmereCamel,
    images: [cashmereCamel],
    inStock: true,
  },
  {
    id: "pashmina-rose",
    name: "Rose Petal Pashmina",
    category: "Pashmina",
    price: 395,
    rating: 5.0,
    description: "Crafted from the rarest Changthangi goat fibers, this rose-hued pashmina represents the pinnacle of luxury.",
    shortDescription: "Rare Changthangi fiber pashmina in soft rose",
    material: "100% Pure Pashmina (Changthangi)",
    origin: "Mustang Region, Nepal",
    image: pashminaRose,
    images: [pashminaRose],
    inStock: true,
  },
  {
    id: "pashmina-burgundy",
    name: "Burgundy Embroidered Pashmina",
    category: "Pashmina",
    price: 450,
    rating: 4.9,
    description: "A masterwork of Nepali craftsmanship, this burgundy pashmina features intricate hand-embroidered patterns.",
    shortDescription: "Hand-embroidered pure pashmina in rich burgundy",
    material: "100% Pure Pashmina",
    origin: "Bhaktapur, Nepal",
    image: pashminaBurgundy,
    images: [pashminaBurgundy],
    inStock: true,
  },
  {
    id: "pashmina-ivory",
    name: "Ivory Cloud Pashmina",
    category: "Pashmina",
    price: 375,
    rating: 4.8,
    description: "Named for its cloud-like softness, this ivory pashmina is woven from the finest undyed fibers.",
    shortDescription: "Undyed natural ivory pashmina of exceptional softness",
    material: "100% Pure Pashmina",
    origin: "Kathmandu Valley, Nepal",
    image: pashminaIvory,
    images: [pashminaIvory],
    inStock: true,
  },
  {
    id: "pashmina-navy",
    name: "Midnight Navy Pashmina",
    category: "Pashmina",
    price: 385,
    rating: 4.7,
    description: "A striking navy pashmina that captures the deep blue of Himalayan twilight.",
    shortDescription: "Deep navy pashmina inspired by Himalayan twilight",
    material: "100% Pure Pashmina",
    origin: "Kathmandu Valley, Nepal",
    image: pashminaNavy,
    images: [pashminaNavy],
    inStock: true,
  },
  {
    id: "yak-natural-brown",
    name: "Natural Yak Wool Shawl",
    category: "Yak Wool",
    price: 195,
    rating: 4.6,
    description: "Sourced from high-altitude yaks of the Himalayan plateau, this natural brown shawl offers unparalleled warmth.",
    shortDescription: "Undyed high-altitude yak wool in natural brown",
    material: "100% Himalayan Yak Wool",
    origin: "Solukhumbu, Nepal",
    image: yakNaturalBrown,
    images: [yakNaturalBrown],
    inStock: true,
  },
  {
    id: "yak-grey",
    name: "Storm Grey Yak Blanket Shawl",
    category: "Yak Wool",
    price: 225,
    rating: 4.8,
    description: "An oversized blanket shawl in storm grey, woven from premium yak wool with a distinctive waffle texture.",
    shortDescription: "Oversized textured yak wool in sophisticated grey",
    material: "100% Himalayan Yak Wool",
    origin: "Manang, Nepal",
    image: yakGrey,
    images: [yakGrey],
    inStock: true,
  },
  {
    id: "yak-herringbone",
    name: "Herringbone Yak Wool Scarf",
    category: "Yak Wool",
    price: 175,
    rating: 4.7,
    description: "A refined herringbone pattern elevates this yak wool scarf from rustic to sophisticated.",
    shortDescription: "Heritage herringbone pattern in rich dark yak wool",
    material: "100% Himalayan Yak Wool",
    origin: "Dolpo, Nepal",
    image: yakHerringbone,
    images: [yakHerringbone],
    inStock: true,
  },
  {
    id: "fine-wool-merino-blend",
    name: "Merino Fine Wool Wrap",
    category: "Fine Wool",
    price: 145,
    rating: 4.5,
    description: "A beautifully soft merino fine wool wrap, perfect for layering in transitional seasons.",
    shortDescription: "Soft merino fine wool in versatile neutral tones",
    material: "100% Fine Merino Wool",
    origin: "Kathmandu Valley, Nepal",
    image: cashmereClassicCream,
    images: [cashmereClassicCream],
    inStock: true,
  },
  {
    id: "fine-wool-twill",
    name: "Twill Weave Fine Wool Stole",
    category: "Fine Wool",
    price: 165,
    rating: 4.6,
    description: "A classic twill weave stole in fine wool, combining texture with lightweight warmth.",
    shortDescription: "Classic twill weave in premium fine wool",
    material: "100% Fine Himalayan Wool",
    origin: "Pokhara, Nepal",
    image: cashmereCharcoal,
    images: [cashmereCharcoal],
    inStock: true,
  },
  {
    id: "modal-silk-blush",
    name: "Blush Modal Silk Scarf",
    category: "Modal Silk",
    price: 210,
    rating: 4.7,
    description: "A luxurious modal silk blend scarf with a beautiful drape and subtle sheen.",
    shortDescription: "Luxurious modal silk blend in soft blush",
    material: "70% Modal, 30% Silk",
    origin: "Kathmandu, Nepal",
    image: pashminaRose,
    images: [pashminaRose],
    inStock: true,
  },
  {
    id: "modal-silk-midnight",
    name: "Midnight Modal Silk Wrap",
    category: "Modal Silk",
    price: 235,
    rating: 4.8,
    description: "An elegant midnight-toned modal silk wrap with a beautiful fluid drape.",
    shortDescription: "Elegant midnight modal silk with fluid drape",
    material: "70% Modal, 30% Silk",
    origin: "Bhaktapur, Nepal",
    image: pashminaNavy,
    images: [pashminaNavy],
    inStock: true,
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (category: Category) => products.filter((p) => p.category === category);
