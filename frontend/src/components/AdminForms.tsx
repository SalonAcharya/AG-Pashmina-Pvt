import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const CategoryForm = ({ onAdd }: { onAdd: () => void }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, slug }),
      });
      if (res.ok) {
        toast.success("Category added!");
        onAdd();
        setName(""); setSlug("");
      }
    } catch (err) { toast.error("Error creating category"); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Category Name" value={name} onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/ /g, '-')); }} required />
      <Input placeholder="Slug" value={slug} readOnly />
      <Button variant="luxury" type="submit" className="w-full text-xs">Create Category</Button>
    </form>
  );
};

export const ProductForm = ({ categories, onAdd }: { categories: any[], onAdd: () => void }) => {
  const [form, setForm] = useState({
    name: "", description: "", price: "", category_id: "", 
    images: [] as string[], sizes: [] as string[], colors: [] as string[], stock_quantity: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Product added!");
        onAdd();
        setForm({ name: "", description: "", price: "", category_id: "", images: [], sizes: [], colors: [], stock_quantity: 0 });
      }
    } catch (err) { toast.error("Error creating product"); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
      <Textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <div className="grid grid-cols-2 gap-4">
        <Input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <Input type="number" placeholder="Stock" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: parseInt(e.target.value)})} />
      </div>
      <select 
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
        value={form.category_id}
        onChange={e => setForm({...form, category_id: e.target.value})}
        required
      >
        <option value="">Select Category</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <Input placeholder="Images URLs (comma separated)" onChange={e => setForm({...form, images: e.target.value.split(',').map(s => s.trim())})} />
      <Input placeholder="Sizes (S, M, L, XL)" onChange={e => setForm({...form, sizes: e.target.value.split(',').map(s => s.trim())})} />
      <Input placeholder="Colors (Red, Blue, Black)" onChange={e => setForm({...form, colors: e.target.value.split(',').map(s => s.trim())})} />
      <Button variant="luxury" type="submit" className="w-full">Create Product</Button>
    </form>
  );
};
