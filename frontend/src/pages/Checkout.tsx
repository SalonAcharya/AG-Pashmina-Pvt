import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";
import { LogIn } from "lucide-react";

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const [isLoggedIn] = useState(false); // Placeholder auth state

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <FadeInUp>
          <div className="text-center">
            <h1 className="font-display text-3xl text-foreground mb-4">Nothing to Checkout</h1>
            <Link to="/shop"><Button variant="luxury" size="lg">Continue Shopping</Button></Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <FadeInUp>
          <div className="max-w-md mx-auto text-center px-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <LogIn size={24} className="text-accent" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-3xl text-foreground mb-3">Sign In to Continue</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Please log in or create an account to continue your purchase. Your cart items are saved.
            </p>
            <div className="space-y-3">
              <Link to="/login" className="block">
                <Button variant="luxury" size="lg" className="w-full">Sign In</Button>
              </Link>
              <Link to="/signup" className="block">
                <Button variant="outline" size="lg" className="w-full font-body text-xs tracking-[0.1em] uppercase">Create Account</Button>
              </Link>
            </div>
            <Link to="/cart" className="inline-block mt-6 font-body text-xs text-muted-foreground hover:text-accent transition-colors">
              ← Back to Cart
            </Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <h1 className="font-display text-4xl font-light text-foreground mb-12">Checkout</h1>
        </FadeInUp>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <FadeInUp>
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-xl text-foreground mb-4">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {["First Name", "Last Name", "Email", "Phone", "Address", "City", "Country", "Postal Code"].map((field) => (
                    <div key={field} className={field === "Address" ? "col-span-2" : ""}>
                      <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">{field}</label>
                      <input className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-xl text-foreground mb-4">Payment</h2>
                <div className="bg-card border border-border rounded-md p-8 text-center">
                  <p className="font-body text-sm text-muted-foreground">Payment integration coming soon</p>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Order Summary */}
          <FadeInUp delay={0.1}>
            <div className="bg-card rounded-lg p-8 shadow-card h-fit sticky top-28">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-14 h-18 rounded overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body text-sm text-foreground">{item.product.name}</p>
                      <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm font-semibold">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-body text-base font-semibold mb-6">
                <span>Total</span><span>${totalPrice}</span>
              </div>
              <Button variant="luxury" size="lg" className="w-full">Place Order</Button>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
