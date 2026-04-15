import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, type Category } from "@/data/products";
import { FadeInUp } from "@/components/FadeInUp";
import { Search, ChevronDown } from "lucide-react";
import fabricTexture from "@/assets/fabric-texture-hero.jpg";

const categories: (Category | "All")[] = ["All", "Cashmere", "Pashmina", "Yak Wool", "Fine Wool", "Modal Silk"];

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as Category | null;
  const [activeCategory, setActiveCategory] = useState<Category | "All">(categoryParam || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    switch (sortBy) {
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "rating": result = [...result].sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (cat: Category | "All") => {
    setActiveCategory(cat);
    setVisibleCount(12);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={fabricTexture} alt="Pashmina fabric texture" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-accent-foreground/70 mb-3">Our Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-accent-foreground">Shop</h1>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 py-10">
        {/* Search, Sort & Filter */}
        <FadeInUp>
          <div className="flex flex-col gap-5 mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-card border border-border rounded-md font-body text-xs text-foreground focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-md font-body text-[11px] tracking-[0.1em] uppercase transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Products Grid - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-muted-foreground">No products found</p>
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="text-center mt-12 pb-8">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="px-8 py-3 border border-accent text-accent font-body text-xs tracking-[0.15em] uppercase font-semibold rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}

        <div className="pb-16" />
      </div>
    </div>
  );
};

export default Shop;
