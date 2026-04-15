import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <FadeInUp>
          <div className="text-center">
            <ShoppingBag size={48} className="text-muted-foreground mx-auto mb-6" strokeWidth={1} />
            <h1 className="font-display text-3xl text-foreground mb-3">Your Cart is Empty</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">Discover our curated collection of luxury Himalayan textiles.</p>
            <Link to="/shop"><Button variant="luxury" size="lg">Continue Shopping</Button></Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <h1 className="font-display text-4xl font-light text-foreground mb-12">Shopping Cart</h1>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <FadeInUp key={item.product.id}>
                <div className="flex gap-6 p-6 bg-card rounded-lg shadow-soft">
                  <Link to={`/product/${item.product.id}`} className="w-24 h-32 rounded-md overflow-hidden shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{item.product.category}</p>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-display text-lg text-foreground hover:text-accent transition-colors">{item.product.name}</h3>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-secondary transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-body text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-secondary transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-body text-sm font-semibold">${item.product.price * item.quantity}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="self-start p-1 hover:text-accent transition-colors">
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </FadeInUp>
            ))}
          </div>

          {/* Summary */}
          <FadeInUp delay={0.1}>
            <div className="bg-card rounded-lg p-8 shadow-card h-fit sticky top-28">
              <h2 className="font-display text-2xl text-foreground mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${totalPrice}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-body text-base font-semibold mb-8">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <Link to="/checkout">
                <Button variant="luxury" size="lg" className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default Cart;
