import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/data/products";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helpers for per-user cart storage
const getUserCartKey = (userId: number | string) => `ag_pashmina_cart_user_${userId}`;

const getLoggedInUserId = (): number | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id ?? null;
  } catch {
    return null;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // On mount: load cart for whoever is currently logged in (handles page refreshes)
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const userId = getLoggedInUserId();
      if (!userId) return [];
      const stored = localStorage.getItem(getUserCartKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("ag_pashmina_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to the current user's localStorage key on every change
  React.useEffect(() => {
    const userId = getLoggedInUserId();
    if (userId) {
      localStorage.setItem(getUserCartKey(userId), JSON.stringify(items));
    }
  }, [items]);

  React.useEffect(() => {
    localStorage.setItem("ag_pashmina_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ── Auth event listeners ────────────────────────────────────────────
  React.useEffect(() => {
    // Login: load that user's saved cart
    const handleLogin = (e: Event) => {
      const { userId } = (e as CustomEvent).detail as { userId: number };
      try {
        const stored = localStorage.getItem(getUserCartKey(userId));
        setItems(stored ? JSON.parse(stored) : []);
      } catch {
        setItems([]);
      }
    };

    // Logout: clear active cart (already saved by the sync effect above)
    const handleLogout = () => {
      setItems([]);
    };

    window.addEventListener("ag_user_login", handleLogin);
    window.addEventListener("ag_user_logout", handleLogout);
    return () => {
      window.removeEventListener("ag_user_login", handleLogin);
      window.removeEventListener("ag_user_logout", handleLogout);
    };
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = (item.product as any).sale_price ?? (item.product as any).price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, wishlist, toggleWishlist }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
