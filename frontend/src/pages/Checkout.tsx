import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";
import { LogIn, ShieldCheck, ChevronLeft, Upload, Loader2, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "@/lib/api";
import { compressImage } from "@/lib/imageUtils";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { isAuthenticated, user, token, incrementOrderCount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: 'Kathmandu',
    country: 'Nepal',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr'>('qr');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [settings, setSettings] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const getImg = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url; // Local frontend asset
    return `${API_BASE_URL}${url}`; // Backend asset
  };
  
  const subtotal = items.reduce((acc, item) => {
    const price = (item.product as any).sale_price || (item.product as any).price;
    return acc + (price * item.quantity);
  }, 0);

  const vat = subtotal * 0.13;
  const deliveryFee = form.district === "Kathmandu" ? 100 : 200;
  const grandTotal = subtotal + vat + deliveryFee;

  const handleFinalize = async () => {
    if (!form.address || !form.phone || !form.district) {
      toast.error("Please fill in required shipping details (Address, Phone, District)");
      return;
    }
    if (paymentMethod === 'qr' && !paymentProof) {
      toast.error("Please upload a payment screenshot for FonePay/QR");
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedProofUrl = null;
      if (paymentMethod === 'qr' && paymentProof) {
        const compressed = await compressImage(paymentProof, "proof");
        const formData = new FormData();
        formData.append("images", compressed);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        uploadedProofUrl = uploadData.urls[0];
      }

      const shipping_address = `${form.address}, ${form.city}, ${form.district}, ${form.country} ${form.postalCode}\nPhone: ${form.phone}`;

      const orderPayload = {
        total_amount: grandTotal,
        vat_amount: vat,
        delivery_fee: deliveryFee,
        shipping_address,
        payment_method: paymentMethod,
        payment_proof: uploadedProofUrl,
        items: items.map(i => ({
          product_id: (i.product as any).id,
          quantity: i.quantity,
          price: (i.product as any).sale_price || (i.product as any).price,
          size: i.size,
          color: i.color
        }))
      };

      const outRes = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload)
      });

      if (!outRes.ok) {
        const errData = await outRes.json().catch(() => ({}));
        throw new Error(errData.message || "Order creation failed");
      }
      toast.success("Order placed successfully!");
      incrementOrderCount();
      clearCart();
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <FadeInUp>
          <div className="text-center px-6">
            <h1 className="font-display text-4xl font-light text-foreground mb-6 uppercase tracking-widest">Nothing to Checkout</h1>
            <Link to="/shop">
              <button className="px-10 py-4 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:shadow-luxury transition-all">
                Discover Collection
              </button>
            </Link>
          </div>
        </FadeInUp>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        <FadeInUp>
          <div className="max-w-md mx-auto text-center px-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-8 shadow-soft">
              <LogIn size={24} className="text-accent" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-4xl font-light text-foreground mb-4 uppercase tracking-[0.1em]">Identity Required</h1>
            <p className="font-body text-sm text-muted-foreground mb-10 leading-relaxed">
              To ensure the security of your Himalayan heirlooms, please sign in or create an account to proceed with your acquisition.
            </p>
            <div className="space-y-4">
              <Link to="/login?redirect=/checkout" className="block">
                <button className="w-full py-4 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:shadow-luxury transition-all">
                  Sign In
                </button>
              </Link>
              <Link to="/signup" className="block">
                <button className="w-full py-4 border border-border text-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-secondary transition-all">
                  Create Account
                </button>
              </Link>
            </div>
            <Link to="/cart" className="inline-flex items-center gap-2 mt-8 font-body text-xs text-muted-foreground hover:text-accent transition-colors font-bold uppercase tracking-widest">
              <ChevronLeft size={14} /> Refine selection
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
          <div className="flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">
            <Link to="/cart">Cart</Link> <span className="opacity-30">/</span> <span className="text-accent">Checkout</span>
          </div>
          <h1 className="font-display text-4xl font-light text-foreground mb-12 uppercase tracking-widest">Acquisition</h1>
        </FadeInUp>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <FadeInUp>
            <div className="space-y-10">
              <section>
                <h2 className="font-display text-2xl text-foreground mb-8 font-light border-b border-border pb-4">Shipping Destination</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">First Name</label>
                    <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">Last Name</label>
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">Email</label>
                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">Address</label>
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">District</label>
                    <select value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer">
                      <option value="Kathmandu">Kathmandu Valley</option>
                      <option value="Outside Kathmandu">Outside Kathmandu Valley</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block font-bold">Postal Code</label>
                    <input value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} className="w-full px-5 py-3.5 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-all" />
                  </div>
                </div>
              </section>
              
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display text-2xl text-foreground font-light">Payment Method</h2>
                  <div className="flex grow h-px bg-border ml-4 opacity-50" />
                </div>
                <div className="flex gap-4 mb-6">
                  <button onClick={() => setPaymentMethod('cod')} className={`flex-1 py-4 border rounded-md font-bold text-xs uppercase tracking-widest transition-all ${paymentMethod === 'cod' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground'}`}>Cash on Delivery</button>
                  <button onClick={() => setPaymentMethod('qr')} className={`flex-1 py-4 border rounded-md font-bold text-xs uppercase tracking-widest transition-all ${paymentMethod === 'qr' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground'}`}>FonePay / QR</button>
                </div>
                
                {paymentMethod === 'qr' && (
                  <div className="bg-secondary/20 border border-dashed border-border rounded-lg p-8 text-center shrink">
                    <h3 className="font-display text-xl mb-4">FonePay Payment</h3>
                    {(() => {
                      // If settings.payment_qr is set, use it. 
                      // Otherwise, use a reliable hosted placeholder or the local one if it existed.
                      const qrSrc = settings.payment_qr 
                        ? getImg(settings.payment_qr) 
                        : "https://res.cloudinary.com/dcb6s4kkh/image/upload/v1713795600/fonepay-qr-placeholder.png"; // Using a hosted backup since local is missing
                      
                      return (
                        <div className="w-48 h-48 mx-auto bg-white p-2 border border-border/50 rounded-md mb-4 shadow-sm overflow-hidden flex items-center justify-center">
                          <img 
                            src={qrSrc} 
                            alt="FonePay QR Code" 
                            className="max-w-full max-h-full object-contain" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Scan+to+Pay";
                            }}
                          />
                        </div>
                      );
                    })()}
                    <a href={settings.payment_qr ? getImg(settings.payment_qr) : "#"} download className="text-[10px] text-accent tracking-widest uppercase font-bold hover:underline mb-2 block">Download QR Code</a>
                    <p className="font-body text-[10px] text-muted-foreground mb-4 uppercase tracking-widest">Amount to pay: <span className="text-accent font-bold">Rs. {grandTotal.toFixed(2)}</span></p>
                    
                    <div className="text-left mt-6 border-t border-border pt-6">
                      <label className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground mb-2 block font-bold text-center">Upload Payment Screenshot *</label>
                      <div className="flex flex-col items-center justify-center relative">
                        <div className="relative border border-border bg-card px-4 py-3 rounded text-xs flex gap-2 items-center w-full max-w-xs overflow-hidden group cursor-pointer hover:border-accent transition-colors">
                          <input type="file" accept="image/*" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" />
                          <Upload size={14} className="text-muted-foreground group-hover:text-accent transition-colors" />
                          <span className="truncate">{paymentProof ? paymentProof.name : "Choose File No file chosen"}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-2">Please upload a clear screenshot of your payment confirmation</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </FadeInUp>

          {/* Order Summary */}
          <FadeInUp delay={0.1}>
            <div className="bg-card rounded-lg p-10 shadow-luxury border border-border/40 h-fit sticky top-28">
              <h2 className="font-display text-2xl text-foreground mb-8 font-light uppercase tracking-widest">Selected Masterpieces</h2>
              <div className="space-y-6 mb-8 pb-8 border-b border-border max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => {
                  const p = item.product as any;
                  const price = p.sale_price || p.price;
                  const img = p.images?.[0] || p.image;
                  
                  return (
                    <div key={p.id} className="flex items-center gap-6 group">
                      <div className="w-16 h-20 rounded shadow-sm overflow-hidden shrink-0 bg-secondary/30">
                        <img src={getImg(img)} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-base text-foreground mb-0.5">{p.name}</p>
                        <p className="font-body text-[10px] tracking-widest text-muted-foreground uppercase py-0.5 px-2 bg-secondary/50 rounded-full w-fit">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-base text-foreground">Rs. {price * item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-body text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  <span>Subtotal</span>
                  <span className="text-foreground">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  <span>VAT (13%)</span>
                  <span className="text-foreground">Rs. {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  <span>Delivery Fee</span>
                  <span className="text-accent">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-display text-2xl mb-12 pt-6 border-t border-border/50">
                <span className="font-light grow uppercase tracking-tight">Total Acquisition</span>
                <span className="font-bold text-accent">Rs. {grandTotal.toFixed(2)}</span>
              </div>
              
              <button disabled={isSubmitting} onClick={handleFinalize} className="w-full py-5 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:shadow-luxury transition-all duration-300 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Finalize Order'}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                <ShieldCheck size={14} />
                <span className="font-body text-[9px] uppercase tracking-[0.2em] font-bold">Guaranteed Authentic Himalayan Craft</span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
