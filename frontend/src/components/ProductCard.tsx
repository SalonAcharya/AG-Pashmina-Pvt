import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:5000";

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addItem, wishlist, toggleWishlist } = useCart();
  const isWished = wishlist.includes(product.id);

  const getImgUrl = () => {
    const rawImg = product.images?.[0] || product.image;
    if (!rawImg) return "";
    return rawImg.startsWith('http') ? rawImg : `${API_BASE_URL}${rawImg}`;
  };

  const name = product.name;
  const price = product.sale_price || product.price;
  const category = product.category_name || product.category;
  const desc = product.shortDescription || product.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-lg bg-card shadow-soft hover:shadow-lift transition-shadow duration-300">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-[4/5] overflow-hidden bg-muted relative">
            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <span className="px-4 py-2 bg-destructive text-white font-body text-[10px] tracking-[0.2em] uppercase font-bold rounded-sm shadow-lg">Sold Out</span>
              </div>
            )}
            {product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5) && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2 py-1 bg-orange-500 text-white font-body text-[8px] tracking-[0.1em] uppercase font-bold rounded shadow-sm">Limited</span>
              </div>
            )}
            <img
              src={getImgUrl()}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-background z-10"
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={isWished ? "fill-accent text-accent" : "text-foreground"}
          />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 z-10">
          <button
            onClick={() => addItem(product)}
            disabled={product.stock_quantity === 0}
            className={`w-full py-2.5 font-body text-[10px] tracking-[0.15em] uppercase font-semibold rounded-md transition-colors ${
              product.stock_quantity === 0 
              ? "bg-secondary text-muted-foreground cursor-not-allowed" 
              : "bg-accent text-accent-foreground hover:bg-accent/90"
            }`}
          >
            {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 px-0.5">
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-accent">
          {category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-base font-medium text-foreground hover:text-accent transition-colors leading-tight line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="font-body text-[11px] text-muted-foreground line-clamp-1">
          {desc}
        </p>
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-body text-sm font-semibold text-foreground">
            Rs. {price}
          </span>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-accent text-accent" />
            <span className="font-body text-[11px] text-muted-foreground">{product.rating || "5.0"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
