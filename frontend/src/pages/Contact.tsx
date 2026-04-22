import { FadeInUp } from "@/components/FadeInUp";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" required />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" required />
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-3 bg-card border border-border rounded-md font-body text-sm focus:outline-none focus:border-accent transition-colors resize-none" required />
              </div>
              <Button variant="luxury" size="lg" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Visit Us", text: "Thamel, Kathmandu, Nepal" },
                { icon: Phone, title: "Call Us", text: "+977 9843759774" },
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

      {/* Map Section */}
      <div className="mt-32 border-t border-border/30 pt-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12 pb-32">
          <FadeInUp>
            <div className="text-center mb-12">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">Our Location</p>
              <h2 className="font-display text-4xl font-light text-foreground mb-4">We Are Here</h2>
              <div className="w-12 h-[1px] bg-accent mx-auto"></div>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <div className="w-full h-[600px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-border/50 bg-card p-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432.5890458705067!2d85.30738665268944!3d27.711592632663333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19cf2a90ecff%3A0x1e6b3458daa6725!2sAG%20Pashmina%20pvt.%20Ltd!5e1!3m2!1sen!2sus!4v1776699865700!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AG Pashmina pvt. Ltd Location"
                className="rounded-[1.5rem] transition-all duration-1000 ease-in-out"
              ></iframe>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};

export default Contact;
