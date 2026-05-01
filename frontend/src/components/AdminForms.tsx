import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { compressImage, formatBytes } from "@/lib/imageUtils";

export const CategoryForm = ({ onAdd, editData, onCancel }: { onAdd: () => void, editData?: any, onCancel?: () => void }) => {
  const [name, setName] = useState(editData?.name || "");
  const [slug, setSlug] = useState(editData?.slug || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(editData?.image || "");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async () => {
    if (!imageFile) return imageUrl;
    setUploading(true);
    try {
      const compressed = await compressImage(imageFile, "thumbnail");
      toast.info(`Uploading image (${formatBytes(compressed.size)})…`, { duration: 2000 });
      const formData = new FormData();
      formData.append("images", compressed);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.urls[0];
    } catch (err) { toast.error("Image upload failed"); return null; }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = await uploadImage();
    if (finalImageUrl === null && imageFile) return;

    const token = localStorage.getItem("token");
    const method = editData ? "PUT" : "POST";
    const url = editData ? `${API_BASE_URL}/api/categories/${editData.id}` : `${API_BASE_URL}/api/categories`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, slug, image: finalImageUrl }),
      });
      if (res.ok) {
        toast.success(editData ? "Category updated!" : "Category added!");
        onAdd();
        if (onCancel) onCancel();
      }
    } catch (err) { toast.error("Error saving category"); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-display">{editData ? "Update Category" : "New Category"}</h2>
        {onCancel && <Button variant="ghost" size="sm" onClick={onCancel}><X size={14} /></Button>}
      </div>
      <Input placeholder="Category Name" value={name} onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/ /g, '-')); }} required />
      <div className="space-y-2">
        <Label className="text-[10px] uppercase">Category Image</Label>
        <div className="flex items-center gap-4">
          {(imageUrl || imageFile) && (
            <div className="w-12 h-12 rounded border overflow-hidden">
              <img src={imageFile ? URL.createObjectURL(imageFile) : imageUrl} className="w-full h-full object-cover" />
            </div>
          )}
          <Input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} className="text-xs" />
        </div>
      </div>
      <Button variant="luxury" type="submit" className="w-full text-xs" disabled={uploading}>{uploading ? <Loader2 className="animate-spin" /> : editData ? "Update" : "Create"}</Button>
    </form>
  );
};

export const BlogForm = ({ onAdd, editData, onCancel }: { onAdd: () => void, editData?: any, onCancel?: () => void }) => {
  const [form, setForm] = useState({
    title: editData?.title || "",
    slug: editData?.slug || "",
    description: editData?.description || "",
    content: editData?.content || "",
    excerpt: editData?.excerpt || "",
    origin: editData?.origin || "",
    fiber: editData?.fiber || "",
    warmth: editData?.warmth || "",
    featured_image: editData?.featured_image || ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = form.featured_image;
    if (imageFile) {
      const compressed = await compressImage(imageFile, "product");
      toast.info(`Uploading image (${formatBytes(compressed.size)})…`, { duration: 2000 });
      const formData = new FormData();
      formData.append("images", compressed);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      finalImageUrl = data.urls[0];
    }

    const token = localStorage.getItem("token");
    const method = editData ? "PUT" : "POST";
    const url = editData ? `${API_BASE_URL}/api/blog/${editData.id}` : `${API_BASE_URL}/api/blog`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, featured_image: finalImageUrl }),
      });
      if (res.ok) {
        toast.success(editData ? "Post updated!" : "Post published!");
        onAdd();
        if (onCancel) onCancel();
      }
    } catch (err) { toast.error("Error saving post"); }
    finally { setUploading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-display">{editData ? "Edit Story" : "New Story"}</h2>
        {onCancel && <Button variant="ghost" size="sm" onClick={onCancel}><X size={14} /></Button>}
      </div>
      <Input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} required />
      <Textarea placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
      <Textarea placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="min-h-[150px]" />
      <div className="grid grid-cols-3 gap-2">
        <Input placeholder="Origin" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} />
        <Input placeholder="Fiber" value={form.fiber} onChange={e => setForm({...form, fiber: e.target.value})} />
        <Input placeholder="Warmth" value={form.warmth} onChange={e => setForm({...form, warmth: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] uppercase">Featured Image</Label>
        <Input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
      </div>
      <Button variant="luxury" type="submit" className="w-full text-xs" disabled={uploading}>
        {uploading ? <Loader2 className="animate-spin" /> : editData ? "Update Story" : "Publish Story"}
      </Button>
    </form>
  );
};

export const ProductForm = ({ categories, onAdd, editData, onCancel }: { categories: any[], onAdd: () => void, editData?: any, onCancel?: () => void }) => {
  const [form, setForm] = useState({
    name: editData?.name || "", 
    slug: editData?.slug || "", 
    description: editData?.description || "", 
    base_price: editData?.base_price?.toString() || "", 
    discount_type: editData?.discount_type || "none", 
    discount_value: editData?.discount_value?.toString() || "0", 
    sale_price: editData?.sale_price?.toString() || "",
    category_id: editData?.category_id || "", 
    images: editData?.images || [] as string[], 
    sizes: editData?.sizes || [] as string[],
    colors: editData?.colors || [] as string[],
    weight: editData?.weight || "",
    stock_quantity: editData?.stock_quantity || 0,
    low_stock_threshold: editData?.low_stock_threshold || 5
  });
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const sizesInputRef = useRef<HTMLInputElement>(null);
  const colorsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const base = parseFloat(form.base_price) || 0;
    const disc = parseFloat(form.discount_value) || 0;
    let sale = base;

    if (form.discount_type === "percentage") {
      sale = base - (base * disc / 100);
    } else if (form.discount_type === "fixed") {
      sale = base - disc;
    }
    
    setForm(prev => ({ ...prev, sale_price: sale.toFixed(2) }));
  }, [form.base_price, form.discount_type, form.discount_value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    setUploading(true);
    try {
      const compressed = await Promise.all(imageFiles.map(f => compressImage(f, "product")));
      const totalKB = Math.round(compressed.reduce((s, f) => s + f.size, 0) / 1024);
      toast.info(`Uploading ${compressed.length} image(s) (${totalKB} KB total)…`, { duration: 2500 });
      const formData = new FormData();
      compressed.forEach(file => formData.append("images", file));
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.urls;
    } catch (err) {
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let uploadedImages = [];
    if (imageFiles.length > 0) {
      const urls = await uploadImages();
      if (urls === null) return;
      uploadedImages = urls;
    }

    // Capture any value typed in the tag inputs but not yet committed with Enter
    const pendingSize = sizesInputRef.current?.value.trim();
    const pendingColor = colorsInputRef.current?.value.trim();
    const finalSizes = pendingSize && !form.sizes.includes(pendingSize)
      ? [...form.sizes, pendingSize] : form.sizes;
    const finalColors = pendingColor && !form.colors.includes(pendingColor)
      ? [...form.colors, pendingColor] : form.colors;

    const finalForm = {
      ...form,
      sizes: finalSizes,
      colors: finalColors,
      images: [...form.images, ...uploadedImages],
      base_price: parseFloat(form.base_price),
      discount_value: parseFloat(form.discount_value),
      sale_price: parseFloat(form.sale_price)
    };
    
    const token = localStorage.getItem("token");
    const method = editData ? "PUT" : "POST";
    const url = editData ? `${API_BASE_URL}/api/products/${editData.id}` : `${API_BASE_URL}/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(finalForm),
      });
      if (res.ok) {
        toast.success(editData ? "Product updated!" : "Product added!");
        await onAdd();
        if (onCancel) onCancel();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to save product");
      }
    } catch (err) { toast.error("Error saving product"); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 bg-card">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-display">{editData ? "Update Product" : "New Product"}</h2>
        {onCancel && <Button type="button" variant="ghost" size="icon" onClick={onCancel}><X size={18} /></Button>}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label>Product Name*</Label>
          <Input value={form.name} onChange={e => {
            const val = e.target.value;
            setForm({...form, name: val, slug: val.toLowerCase().replace(/ /g, '-')});
          }} required />
        </div>

        <div className="space-y-2">
          <Label>Category*</Label>
          <select 
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            value={form.category_id}
            onChange={e => setForm({...form, category_id: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="min-h-[100px]" />
        </div>

        <div className="p-4 border border-border rounded-lg bg-secondary/20 space-y-4">
          <h3 className="text-sm font-semibold">Pricing & Discounts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Base Price*</Label>
              <Input type="number" value={form.base_price} onChange={e => setForm({...form, base_price: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})}>
                <option value="none">None</option><option value="fixed">Fixed</option><option value="percentage">Percent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Value</Label>
              <Input type="number" value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Final Price</Label>
              <Input value={form.sale_price} readOnly className="bg-muted font-bold" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Stock*</Label><Input type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: parseInt(e.target.value)})} required /></div>
          <div className="space-y-2"><Label>Threshold</Label><Input type="number" value={form.low_stock_threshold} onChange={e => setForm({...form, low_stock_threshold: parseInt(e.target.value)})} /></div>
        </div>

        <div className="space-y-3">
          <Label>Images</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((url, idx) => (
              <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden group">
                <img src={url.startsWith('http') ? url : `${API_BASE_URL}${url}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 bg-destructive text-white p-0.5 opacity-0 group-hover:opacity-100"><X size={10} /></button>
              </div>
            ))}
            {imageFiles.map((file, idx) => (
              <div key={`new-${idx}`} className="relative w-16 h-16 border-2 border-accent/50 rounded overflow-hidden group">
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageFiles(files => files.filter((_, i) => i !== idx))} className="absolute top-0 right-0 bg-destructive text-white p-0.5 opacity-0 group-hover:opacity-100"><X size={10} /></button>
              </div>
            ))}
            <label className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-accent text-muted-foreground hover:text-accent transition-colors">
              <Plus size={16} /><input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <Label>Sizes <span className="text-muted-foreground text-xs font-normal">(type one size, press Enter to add)</span></Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.sizes.map((s: string, idx: number) => (
              <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-secondary border border-border rounded-full text-xs font-bold">
                {s}
                <button type="button" onClick={() => setForm({...form, sizes: form.sizes.filter((_: string, i: number) => i !== idx)})}><X size={10} /></button>
              </span>
            ))}
          </div>
          <Input
            ref={sizesInputRef}
            placeholder="Type a size and press Enter — e.g. S then Enter, M then Enter"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !form.sizes.includes(val)) {
                  setForm(prev => ({ ...prev, sizes: [...prev.sizes, val] }));
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <Label>Colors <span className="text-muted-foreground text-xs font-normal">(type one color, press Enter to add)</span></Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.colors.map((c: string, idx: number) => (
              <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-secondary border border-border rounded-full text-xs font-bold">
                {c}
                <button type="button" onClick={() => setForm({...form, colors: form.colors.filter((_: string, i: number) => i !== idx)})}><X size={10} /></button>
              </span>
            ))}
          </div>
          <Input
            ref={colorsInputRef}
            placeholder="Type a color and press Enter — e.g. Red then Enter"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !form.colors.includes(val)) {
                  setForm(prev => ({ ...prev, colors: [...prev.colors, val] }));
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label>Weight</Label>
          <Input
            placeholder="e.g. 90-100 Grams, 120g"
            value={form.weight}
            onChange={e => setForm({...form, weight: e.target.value})}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {onCancel && <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>}
        <Button variant="luxury" type="submit" className="flex-1" disabled={uploading}>{uploading ? <Loader2 className="animate-spin" /> : editData ? "Apply Changes" : "Save Product"}</Button>
      </div>
    </form>
  );
};
