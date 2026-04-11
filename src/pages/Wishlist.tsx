import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { FadeInUp } from "@/components/FadeInUp";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { wishlist } = useCart();
  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishedProducts.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <FadeInUp>
          <div className="text-center">
            <Heart size={48} className="text-muted-foreground mx-auto mb-6" strokeWidth={1} />
            <h1 className="font-display text-3xl text-foreground mb-3">Your Wishlist is Empty</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">Save your favorite pieces for later.</p>
            <Link to="/shop"><Button variant="luxury" size="lg">Browse Collection</Button></Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <h1 className="font-display text-4xl font-light text-foreground mb-12">Wishlist</h1>
        </FadeInUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
