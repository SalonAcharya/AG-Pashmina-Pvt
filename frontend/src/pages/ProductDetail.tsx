import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { FadeInUp } from "@/components/FadeInUp";
import { Heart, Minus, Plus, ChevronLeft, Star, Truck, RotateCcw, Shield } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id || "");
  const { addItem, wishlist, toggleWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop"><Button variant="luxury">Back to Shop</Button></Link>
        </div>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const isWished = wishlist.includes(product.id);

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <FadeInUp>
          <Link to="/shop" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-accent transition-colors mb-8">
            <ChevronLeft size={14} /> Back to Shop
          </Link>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <FadeInUp>
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-card">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </FadeInUp>

          {/* Details */}
          <FadeInUp delay={0.15}>
            <div className="py-4">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-3">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"} />
                  ))}
                </div>
                <span className="font-body text-xs text-muted-foreground">{product.rating} / 5</span>
              </div>
              <p className="font-display text-3xl text-foreground mb-8">${product.price}</p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Info */}
              <div className="space-y-3 mb-8 pb-8 border-b border-border">
                <div className="flex">
                  <span className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground w-24">Material</span>
                  <span className="font-body text-sm text-foreground">{product.material}</span>
                </div>
                <div className="flex">
                  <span className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground w-24">Origin</span>
                  <span className="font-body text-sm text-foreground">{product.origin}</span>
                </div>
                <div className="flex">
                  <span className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground w-24">Status</span>
                  <span className="font-body text-sm text-success font-medium">In Stock</span>
                </div>
              </div>

              {/* Quantity & Add */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-md">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center font-body text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <Button variant="luxury" size="lg" className="flex-1" onClick={() => addItem(product, quantity)}>
                  Add to Cart
                </Button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-12 h-12 border border-border rounded-md flex items-center justify-center hover:border-accent transition-colors"
                >
                  <Heart size={18} strokeWidth={1.5} className={isWished ? "fill-accent text-accent" : "text-foreground"} />
                </button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { icon: Truck, label: "Free Shipping" },
                  { icon: RotateCcw, label: "Easy Returns" },
                  { icon: Shield, label: "Authenticity" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center gap-2">
                    <item.icon size={18} className="text-accent" strokeWidth={1.5} />
                    <span className="font-body text-[10px] tracking-[0.1em] uppercase text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-24">
            <FadeInUp>
              <h2 className="font-display text-3xl font-light text-foreground mb-12">You May Also Like</h2>
            </FadeInUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
