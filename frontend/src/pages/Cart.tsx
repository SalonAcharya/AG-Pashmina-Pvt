import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const Cart = () => {
  const { items, removeItem, updateQuantity } = useCart();

  const getImg = (url: string | undefined) => {
    if (!url) return "/placeholder-product.jpg";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };
  
  // Recalculate total price based on sale_price if available
  const totalPrice = items.reduce((acc, item) => {
    const price = item.product.sale_price || item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <FadeInUp>
          <div className="text-center px-6">
            <ShoppingBag size={48} className="text-muted-foreground mx-auto mb-6" strokeWidth={1} />
            <h1 className="font-display text-3xl text-foreground mb-3 font-light uppercase tracking-widest">Your Treasury is Empty</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">Begin your journey through Himalayan craftsmanship.</p>
            <Link to="/shop"><Button variant="luxury" size="lg" className="px-10">Explore Collection</Button></Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <h1 className="font-display text-4xl font-light text-foreground mb-12">Your Selection</h1>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const p = item.product;
              const price = p.sale_price || p.price;
              const img = p.images?.[0] || p.image;
              const category = p.category_name || p.category;

              return (
                <FadeInUp key={p.id}>
                  <div className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-lg shadow-soft border border-border/40 group hover:border-accent/20 transition-all">
                    <Link to={`/product/${p.id}`} className="w-full sm:w-24 h-48 sm:h-32 rounded-md overflow-hidden shrink-0 bg-secondary/20">
                      <img src={getImg(img)} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-body text-[9px] tracking-[0.3em] uppercase text-accent font-bold mb-1">{category}</p>
                          <Link to={`/product/${p.id}`}>
                            <h3 className="font-display text-xl text-foreground hover:text-accent transition-colors leading-tight">{p.name}</h3>
                          </Link>
                        </div>
                        <button onClick={() => removeItem(p.id)} className="p-2 hover:text-accent transition-colors opacity-40 hover:opacity-100">
                          <X size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-background border border-border rounded-md">
                          <button onClick={() => updateQuantity(p.id, item.quantity - 1)} className="p-2.5 hover:text-accent transition-colors"><Minus size={12} /></button>
                          <span className="w-8 text-center font-body text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(p.id, item.quantity + 1)} className="p-2.5 hover:text-accent transition-colors"><Plus size={12} /></button>
                        </div>
                        <span className="font-display text-lg text-foreground">Rs. {price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}
          </div>

          {/* Summary */}
          <FadeInUp delay={0.1}>
            <div className="bg-card rounded-lg p-8 shadow-luxury border border-border/40 h-fit sticky top-28">
              <h2 className="font-display text-2xl text-foreground mb-6 font-light uppercase tracking-widest">Summary</h2>
              <div className="space-y-4 mb-8 pb-8 border-b border-border">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="text-foreground font-bold">Rs. {totalPrice}</span>
                </div>
              </div>
              <div className="flex justify-between font-display text-xl mb-10">
                <span className="font-light">Grand Total</span>
                <span className="font-bold">Rs. {totalPrice}</span>
              </div>
              <Link to="/checkout">
                <button className="w-full py-4 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:shadow-luxury transition-all duration-300">
                  Secure Checkout
                </button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default Cart;
