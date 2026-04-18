import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<Education />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
