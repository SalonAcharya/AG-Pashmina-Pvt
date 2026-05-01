import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "@/components/ProductCard";
import { FadeInUp } from "@/components/FadeInUp";
import { Heart, Minus, Plus, Star, Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";
import SEO from "@/components/SEO";

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem, wishlist, toggleWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  useEffect(() => {
    // Load recently viewed on mount
    try {
      const stored = localStorage.getItem("ag_pashmina_recent");
      if (stored) {
        setRecentViews(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data);
        
        // Fetch related products (same category)
        if (data.category_id) {
          const relRes = await fetch(`${API_BASE_URL}/api/products`);
          const relData = await relRes.json();
          setRelated(relData.filter((p: any) => p.category_id === data.category_id && p.id !== data.id).slice(0, 4));
        }

        // Add to recently viewed
        try {
          const stored = JSON.parse(localStorage.getItem("ag_pashmina_recent") || "[]");
          const filtered = stored.filter((p: any) => p.id !== data.id);
          const newRecent = [data, ...filtered].slice(0, 4);
          localStorage.setItem("ag_pashmina_recent", JSON.stringify(newRecent));
          setRecentViews(newRecent);
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Product fetch failed", err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    setCurrentImageIndex(0);
    setQuantity(1);
  }, [id]);

  // Auto-swipe logic
  useEffect(() => {
    if (product?.images?.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-secondary/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mb-4 mx-auto" />
          <p className="font-display text-lg italic text-muted-foreground animate-pulse">Unweaving Himalayan Luxury...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 text-center max-w-md px-6">
          <FadeInUp>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-accent mb-6">404 Error</p>
            <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6 leading-tight">Masterpiece Not Found</h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-10">
              The Himalayan wind has carried this piece away. It may be sold out or moved to our archives.
            </p>
            <Link to="/shop">
              <button className="px-10 py-4 bg-accent text-accent-foreground font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:shadow-luxury transition-all duration-300">
                Back to Collection
              </button>
            </Link>
          </FadeInUp>
        </div>
      </div>
    );
  }

  const getImg = (url: string) => url?.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const images = product.images || [product.image];
  const isWished = wishlist.includes(product.id);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images.map((img: string) => getImg(img)),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "AG Pashmina"
    },
    "offers": {
      "@type": "Offer",
      "url": `${window.location.origin}/product/${product.id}`,
      "priceCurrency": "NPR",
      "price": product.sale_price,
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-background">
      <SEO 
        title={product.name}
        description={`${product.name} - ${product.description.substring(0, 160)}...`}
        image={getImg(images[0])}
        url={window.location.href}
        schema={productSchema}
      />
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <FadeInUp>
          <div className="flex items-center gap-2 mb-8 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
            <Link to="/" className="hover:text-accent font-semibold transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-accent font-semibold transition-colors">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-accent font-bold truncate max-w-[150px]">{product.name}</span>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Luxury Carousel */}
          <FadeInUp>
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-card shadow-soft group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={getImg(images[currentImageIndex])}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentImageIndex ? "w-8 bg-accent" : "w-1.5 bg-accent/30 hover:bg-accent/50"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 aspect-[3/4] rounded-md overflow-hidden border-2 transition-all duration-300 ${idx === currentImageIndex ? "border-accent shadow-md scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={getImg(img)} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FadeInUp>

          {/* Details */}
          <FadeInUp delay={0.15}>
            <div className="py-2">
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-accent mb-4 font-bold">{product.category_name}</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-5 leading-[1.1]">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < 5 ? "fill-current" : "text-border"} strokeWidth={1.5} />
                  ))}
                </div>
                <span className="font-body text-xs text-muted-foreground uppercase tracking-widest border-l border-border pl-4">Authentic Product</span>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <p className="font-display text-4xl text-foreground">Rs. {product.sale_price}</p>
                {product.base_price > product.sale_price && (
                  <p className="font-display text-2xl text-muted-foreground line-through opacity-50">Rs. {product.base_price}</p>
                )}
              </div>

              <div className="font-body text-sm text-muted-foreground leading-relaxed mb-6 space-y-3">
                {product.description
                  ? product.description.split("\n").map((line: string, i: number) =>
                      line.trim() ? (
                        <p key={i}>{line}</p>
                      ) : (
                        <br key={i} />
                      )
                    )
                  : null}
              </div>
              
              {product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5) && (
                <p className="font-body text-[10px] tracking-[0.1em] text-orange-600 font-bold uppercase mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  Order soon — only {product.stock_quantity} pieces remaining in our vault.
                </p>
              )}

              {product.stock_quantity === 0 && (
                <p className="font-body text-[10px] tracking-[0.1em] text-destructive font-bold uppercase mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  This masterpiece is currently unavailable.
                </p>
              )}

              <div className="grid grid-cols-2 gap-y-8 mb-12">
                <div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Material</p>
                  <p className="font-body text-sm font-semibold">{product.category_name || "100% Cashmere"}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Shipping</p>
                  <p className="font-body text-sm font-semibold text-accent">Delivery all over Nepal</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Status</p>
                  {product.stock_quantity === 0 ? (
                    <p className="font-body text-sm text-destructive font-bold uppercase tracking-tighter animate-pulse">Sold Out</p>
                  ) : product.stock_quantity <= (product.low_stock_threshold || 5) ? (
                    <p className="font-body text-sm text-orange-600 font-bold uppercase tracking-tighter">Limited Stock</p>
                  ) : (
                    <p className="font-body text-sm text-success font-bold uppercase tracking-tighter">In Stock</p>
                  )}
                </div>

                {product.weight && (
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Weight</p>
                    <p className="font-body text-sm font-semibold">{product.weight}</p>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                      Size
                      {selectedSize && (
                        <span className="ml-2 text-accent normal-case font-semibold tracking-normal">— {selectedSize}</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s: string) => (
                        <button
                          key={s}
                          type="button"
                          title={s}
                          onClick={() => setSelectedSize(s === selectedSize ? undefined : s)}
                          className={`relative min-w-[2.75rem] h-10 px-4 rounded-full border-2 font-body text-[11px] uppercase tracking-widest font-bold transition-all duration-200 focus:outline-none ${
                            selectedSize === s
                              ? "border-accent bg-accent text-accent-foreground shadow-md scale-105"
                              : "border-border bg-background text-muted-foreground hover:border-accent hover:text-accent hover:scale-105"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors?.length > 0 && (
                  <div className={product.sizes?.length > 0 ? "col-span-2" : ""}>
                    <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                      Color
                      {selectedColor && (
                        <span className="ml-2 text-accent normal-case font-semibold tracking-normal">— {selectedColor}</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((c: string) => {
                        const isSelected = selectedColor === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            title={c}
                            onClick={() => setSelectedColor(c === selectedColor ? undefined : c)}
                            className={`group relative flex flex-col items-center gap-1.5 focus:outline-none`}
                          >
                            <span
                              className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                                isSelected
                                  ? "border-accent scale-110 shadow-md"
                                  : "border-border/40 hover:border-accent/60 hover:scale-110"
                              }`}
                              style={{ backgroundColor: c.toLowerCase().replace(/\s+/g, '') }}
                            >
                              {isSelected && (
                                <svg
                                  className="w-4 h-4 drop-shadow"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M3 8l3.5 3.5L13 5" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
                                </svg>
                              )}
                            </span>
                            <span
                              className={`font-body text-[9px] uppercase tracking-wider transition-colors duration-200 ${
                                isSelected ? "text-accent font-bold" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                              }`}
                            >
                              {c}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Add */}
              <div className="flex flex-col gap-4 mb-12">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className={`flex items-center bg-card border border-border rounded-md px-2 h-14 ${product.stock_quantity === 0 ? "opacity-30 pointer-events-none" : ""}`}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:text-accent transition-colors"><Minus size={14} /></button>
                    <span className="w-10 text-center font-body text-sm font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="p-4 hover:text-accent transition-colors"><Plus size={14} /></button>
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Please sign in to add items to your cart");
                        navigate(`/login?redirect=/product/${id}`);
                        return;
                      }
                      addItem(product, quantity, selectedSize, selectedColor);
                      toast.success("Added to cart");
                    }}
                    disabled={product.stock_quantity === 0}
                    className={`flex-1 px-8 py-4 font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md transition-all duration-300 ${
                      product.stock_quantity === 0 
                      ? "bg-secondary text-muted-foreground cursor-not-allowed border border-border" 
                      : "bg-accent text-accent-foreground hover:shadow-luxury"
                    }`}
                  >
                    {product.stock_quantity === 0 ? "Currently Unavailable" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex-1 sm:flex-none sm:w-14 h-14 border border-border rounded-md flex items-center justify-center transition-all duration-300 ${isWished ? "bg-accent/5 border-accent" : "hover:border-accent"}`}
                  >
                    <Heart size={20} strokeWidth={1.5} className={isWished ? "fill-accent text-accent" : "text-foreground"} />
                    <span className="sm:hidden ml-2 font-body text-xs uppercase tracking-widest font-bold">Wishlist</span>
                  </button>
                </div>
                <a
                  href={`https://wa.me/9779843759774?text=${encodeURIComponent(`Hi, I am interested in the ${product.name} (Rs. ${product.sale_price}). Is this currently available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center py-4 bg-[#25D366] text-white font-body text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#20bd5a] transition-all duration-300"
                >
                  Enquire on WhatsApp
                </a>
              </div>

              {/* Trust badges */}
              {/* <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border">
                {[
                  { icon: Truck, label: "Eco-Shipping" },
                  { icon: RotateCcw, label: "90-Day Returns" },
                  { icon: Shield, label: "Lifetime Guarantee" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <item.icon size={18} className="text-accent" strokeWidth={1.5} />
                    </div>
                    <span className="font-body text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-bold">{item.label}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </FadeInUp>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-24 border-t border-border mt-12">
            <FadeInUp>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-2xl font-medium tracking-[0.1em] text-foreground uppercase">Related Products</h2>
                <Link to="/shop" className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase font-bold hover:text-accent transition-all">View All</Link>
              </div>
            </FadeInUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentViews.filter(p => p.id !== product.id).length > 0 && (
          <section className="py-24 border-t border-border">
            <FadeInUp>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-2xl font-medium tracking-[0.1em] text-foreground uppercase">Recently Viewed</h2>
              </div>
            </FadeInUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentViews.filter(p => p.id !== product.id).map((p) => (
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
