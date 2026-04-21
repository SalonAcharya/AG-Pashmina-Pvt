import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { FadeInUp } from "@/components/FadeInUp";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { API_BASE_URL } from "@/lib/api";

const Wishlist = () => {
  const { wishlist } = useCart();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const wishedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (wishedProducts.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <FadeInUp>
          <div className="text-center px-6">
            <Heart size={48} className="text-muted-foreground mx-auto mb-6 opacity-30" strokeWidth={1} />
            <h1 className="font-display text-4xl text-foreground mb-4 font-light uppercase tracking-widest">Your Wishlist is Empty</h1>
            <p className="font-body text-sm text-muted-foreground mb-10 tracking-wide">Save your favorite pieces for later.</p>
            <Link to="/shop">
              <button className="px-10 py-4 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:shadow-luxury transition-all duration-300">
                Browse Collection
              </button>
            </Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <h1 className="font-display text-4xl font-light text-foreground mb-12 uppercase tracking-widest">Wishlist</h1>
        </FadeInUp>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
