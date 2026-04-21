import { useState, useEffect } from "react";
import { FadeInUp } from "@/components/FadeInUp";
import { Loader2 } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

const Education = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/blog`);
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Blogs fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getImg = (url: string) => url?.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">The Craft</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">Know Your Fiber</h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Understanding the origin, character, and craftsmanship behind each fiber helps you choose the perfect piece — and appreciate the heritage woven into every thread.
            </p>
          </div>
        </FadeInUp>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent h-12 w-12" /></div>
        ) : (
          <div className="space-y-24 pb-24">
            {blogs.map((fiber: any, i) => (
              <FadeInUp key={fiber.id}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-luxury">
                      <img src={getImg(fiber.featured_image)} alt={fiber.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">{fiber.title}</h2>
                    <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
                      <div>
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Origin</p>
                        <p className="font-body text-xs text-foreground">{fiber.origin || "Himalayas"}</p>
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Fiber</p>
                        <p className="font-body text-xs text-foreground">{fiber.fiber || "Premium Grade"}</p>
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Warmth</p>
                        <p className="font-body text-xs text-foreground">{fiber.warmth || "Ultimate Comfort"}</p>
                      </div>
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{fiber.content}</p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed italic opacity-80">{fiber.excerpt}</p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
