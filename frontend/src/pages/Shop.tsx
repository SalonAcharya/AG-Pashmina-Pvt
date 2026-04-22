import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { FadeInUp } from "@/components/FadeInUp";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import fabricTexture from "@/assets/fabric-texture-hero.jpg";
import SEO from "@/components/SEO";

import { API_BASE_URL } from "@/lib/api";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/categories`)
        ]);
        const pData = await pRes.json();
        const cData = await cRes.json();
        setProducts(Array.isArray(pData) ? pData : []);
        setCategories(Array.isArray(cData) ? cData : []);
      } catch (err) {
        console.error("Shop fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter((p: any) => {
      const matchCategory = activeCategory === "All" || p.category_id?.toString() === activeCategory || p.category_name === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });

    const getPrice = (p: any) => p.sale_price ?? p.base_price ?? 0;
    if (sortBy === "price-asc") result = [...result].sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === "price-desc") result = [...result].sort((a, b) => getPrice(b) - getPrice(a));
    
    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setVisibleCount(12);
    if (catId === "All") searchParams.delete("category");
    else searchParams.set("category", catId);
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Shop Himalayan Luxury"
        description="Explore our curated collection of handcrafted Pashmina, Cashmere, and Yak wool shawls. Each piece is a masterpiece of Himalayan heritage."
      />
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={fabricTexture} 
            alt="Intricate Fabric Texture of AG Pashmina Textiles" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative z-10 text-center"><p className="text-xs tracking-widest uppercase text-accent-foreground/70 mb-3">Our Collection</p><h1 className="font-display text-6xl text-accent-foreground">Shop</h1></div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 py-10">
        <FadeInUp>
          <div className="flex flex-col gap-5 mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-md" />
              </div>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-9 py-2.5 bg-card border rounded-md">
                  <option value="default">Default</option><option value="price-asc">Price: Low-High</option><option value="price-desc">Price: High-Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleCategoryChange("All")} className={`px-4 py-2 rounded-md text-[11px] uppercase tracking-tighter transition-all ${activeCategory === "All" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}>All</button>
              {categories.map((c: any) => (
                <button key={c.id} onClick={() => handleCategoryChange(c.id.toString())} className={`px-4 py-2 rounded-md text-[11px] uppercase tracking-tighter transition-all ${activeCategory === c.id.toString() || activeCategory === c.name ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {filtered.slice(0, visibleCount).map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {filtered.length === 0 && !isLoading && <div className="text-center py-24 text-muted-foreground italic">No products matched your criteria</div>}
        
        {visibleCount < filtered.length && (
          <div className="text-center mt-12"><button onClick={() => setVisibleCount(c => c + 12)} className="px-8 py-3 bg-accent text-accent-foreground rounded uppercase text-[10px] font-bold">Load More</button></div>
        )}
      </div>
    </div>
  );
};

export default Shop;
