import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/FadeInUp";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <FadeInUp>
        <div className="max-w-sm w-full mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl text-foreground mb-2">Create Account</h1>
            <p className="font-body text-sm text-muted-foreground">Join the AG Pashmina family</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <Button variant="luxury" size="lg" className="w-full mt-2" type="submit">Create Account</Button>
          </form>
          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default Signup;
