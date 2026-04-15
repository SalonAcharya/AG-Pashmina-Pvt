import { useState, useEffect } from "react";
import { FadeInUp } from "@/components/FadeInUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blog");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeInUp>
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">The Craft</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">Blog</h1>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">Explore the heritage, techniques, and stories behind our craft.</p>
          </div>
        </FadeInUp>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <FadeInUp key={post.id}>
                <Card className="overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground italic">No image</div>
                    )}
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="font-display text-xl mb-2 line-clamp-2">{post.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mb-4">{new Date(post.created_at).toLocaleDateString()}</p>
                    <p className="font-body text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardHeader>
                </Card>
              </FadeInUp>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
