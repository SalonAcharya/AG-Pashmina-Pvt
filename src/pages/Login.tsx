import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <FadeInUp>
        <div className="max-w-sm w-full mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl text-foreground mb-2">Welcome Back</h1>
            <p className="font-body text-sm text-muted-foreground">Sign in to your AG Pashmina account</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <Button variant="luxury" size="lg" className="w-full mt-2" type="submit">Sign In</Button>
          </form>
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
