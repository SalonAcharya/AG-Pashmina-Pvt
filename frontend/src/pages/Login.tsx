import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        toast.success("Welcome back!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <FadeInUp>
        <div className="max-w-sm w-full mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl text-foreground mb-2">Welcome Back</h1>
            <p className="font-body text-sm text-muted-foreground">Sign in to your AG Pashmina account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" 
                required
              />
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" 
                required
              />
            </div>
            <Button variant="luxury" size="lg" className="w-full mt-2" type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full font-body" 
            onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Google Login
          </Button>

          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent hover:underline">Create one</Link>
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default Login;
