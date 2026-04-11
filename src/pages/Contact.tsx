import { FadeInUp } from "@/components/FadeInUp";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">Contact Us</h1>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">We'd love to hear from you. Whether you have a question or simply want to say hello.</p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <FadeInUp>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors resize-none" />
              </div>
              <Button variant="luxury" size="lg" type="submit">Send Message</Button>
            </form>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Visit Us", text: "Thamel, Kathmandu, Nepal" },
                { icon: Phone, title: "Call Us", text: "+977 1 4XXXXXX" },
                { icon: Mail, title: "Email Us", text: "info@agpashmina.com" },
                { icon: Clock, title: "Hours", text: "Sun–Fri: 10AM – 6PM (NPT)" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-body text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="font-body text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default Contact;
