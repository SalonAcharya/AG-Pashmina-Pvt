import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Package, List, ShoppingBag, MessageSquare, BookOpen, Edit2, Trash2, X, Settings as SettingsIcon } from "lucide-react";
import { CategoryForm, ProductForm, BlogForm } from "@/components/AdminForms";

const API_BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const { token, isAdmin } = useAuth();
  const [data, setData] = useState({ orders: [], categories: [], products: [], messages: [], blogs: [], settings: {} as any });
  const [isLoading, setIsLoading] = useState(true);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<{ type: string, item: any } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [o, c, p, m, b, s] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/categories`).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/products`).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/contact-messages`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/blog`).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/settings`).then(r => r.json()),
      ]);
      setData({ orders: o, categories: c, products: p, messages: m, blogs: b, settings: s });
    } catch (err) { toast.error("Error loading data"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      const endpoint = type === 'message' ? 'contact-messages' : type === 'blog' ? 'blog' : type + 's';
      const res = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { fetchData(); toast.success("Deleted!"); }
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleStatusUpdate = async (id: number, status: string | null, paymentStatus: string | null) => {
    try {
      const payload: any = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.payment_status = paymentStatus;
      
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) { toast.success("Order updated"); fetchData(); }
    } catch { toast.error("Update failed"); }
  };

  const handleSettingsSave = async () => {
    try {
      let finalUrl = undefined;
      if (qrFile) {
        const formData = new FormData();
        formData.append("images", qrFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData
        });
        const uploadData = await uploadRes.json();
        finalUrl = uploadData.urls[0];
      }
      
      if (finalUrl) {
        await fetch(`${API_BASE_URL}/api/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ payment_qr: finalUrl })
        });
        toast.success("Settings saved");
        fetchData();
        setQrFile(null);
      }
    } catch { toast.error("Error saving settings"); }
  };

  const getImg = (url: string) => url?.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-12 relative">
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-card border-accent/20">
            <CardContent className="p-6">
              {editing.type === 'product' && <ProductForm categories={data.categories} editData={editing.item} onAdd={fetchData} onCancel={() => setEditing(null)} />}
              {editing.type === 'category' && <CategoryForm editData={editing.item} onAdd={fetchData} onCancel={() => setEditing(null)} />}
              {editing.type === 'blog' && <BlogForm editData={editing.item} onAdd={fetchData} onCancel={() => setEditing(null)} />}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display text-4xl">Admin Dashboard</h1>
          <Button variant="luxury" onClick={fetchData}>Refresh</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-accent" /></div>
        ) : (
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-card border w-full justify-start p-1 gap-1 overflow-x-auto">
              <TabsTrigger value="products" className="gap-2"><Package size={14} /> Products</TabsTrigger>
              <TabsTrigger value="categories" className="gap-2"><List size={14} /> Categories</TabsTrigger>
              <TabsTrigger value="orders" className="gap-2"><ShoppingBag size={14} /> Orders</TabsTrigger>
              <TabsTrigger value="blogs" className="gap-2"><BookOpen size={14} /> Blogs</TabsTrigger>
              <TabsTrigger value="messages" className="gap-2"><MessageSquare size={14} /> Messages</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><SettingsIcon size={14} /> Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-accent/20"><CardHeader><CardTitle>Add Product</CardTitle></CardHeader>
                  <CardContent><ProductForm categories={data.categories} onAdd={fetchData} /></CardContent>
                </Card>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                  {data.products.map((p: any) => (
                    <Card key={p.id} className="overflow-hidden group h-fit">
                      <div className="aspect-square relative bg-muted">
                        {p.images?.[0] ? <img src={getImg(p.images[0])} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[10px]">No image</div>}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditing({type:'product', item:p})}><Edit2 size={12} /></Button>
                          <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDelete('product', p.id)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-1 text-sm font-bold"><span>{p.name}</span><span className="text-accent">Rs.{p.sale_price}</span></div>
                        <p className="text-[10px] text-muted-foreground uppercase">{p.category_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blogs">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-accent/20"><CardHeader><CardTitle>Write Article</CardTitle></CardHeader>
                  <CardContent><BlogForm onAdd={fetchData} /></CardContent>
                </Card>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {data.blogs.map((b: any) => (
                    <Card key={b.id} className="group overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        {b.featured_image ? <img src={getImg(b.featured_image)} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[10px]">No image</div>}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditing({type:'blog', item:b})}><Edit2 size={12} /></Button>
                          <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDelete('blog', b.id)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-display text-md mb-2">{b.title}</h3>
                        <div className="flex gap-2 text-[10px] text-muted-foreground italic mb-1">
                          <span>{b.origin}</span><span>|</span><span>{b.fiber}</span>
                        </div>
                        <p className="text-xs line-clamp-2 text-muted-foreground">{b.excerpt}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-accent/20"><CardHeader><CardTitle>Add Category</CardTitle></CardHeader>
                  <CardContent><CategoryForm onAdd={fetchData} /></CardContent>
                </Card>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {data.categories.map((c: any) => (
                    <Card key={c.id} className="group overflow-hidden relative border-accent/10">
                      <div className="h-32 bg-muted relative">
                        {c.image ? <img src={getImg(c.image)} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[10px]">No image</div>}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditing({type:'category', item:c})}><Edit2 size={12} /></Button>
                          <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDelete('category', c.id)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                      <CardContent className="p-3 text-center">
                        <p className="font-bold">{c.name}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">{c.slug}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="border-accent/10"><CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left"><th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4 text-right">Total</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Payment</th><th className="p-4 text-center">Proof</th><th className="p-4 text-right">Action</th></tr></thead>
                  <tbody>{data.orders.map((o: any) => (
                    <tr key={o.id} className="border-b hover:bg-muted/30">
                      <td className="p-4 font-mono text-xs">#{String(o.id).padStart(5, '0')}</td>
                      <td className="p-4"><div><p className="font-bold">{o.user_name}</p><p className="text-[10px]">{new Date(o.created_at).toLocaleDateString()}</p></div></td>
                      <td className="p-4 text-right">
                        <p className="font-bold">Rs.{o.total_amount}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{o.payment_method || 'cod'}</p>
                      </td>
                      <td className="p-4 text-center">
                        <select className="text-[10px] uppercase font-bold border rounded px-1 py-1 bg-transparent cursor-pointer" value={o.status || 'pending'} onChange={(e) => handleStatusUpdate(o.id, e.target.value, null)}>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <select className={`text-[10px] uppercase font-bold border rounded px-1 py-1 bg-transparent cursor-pointer ${o.payment_status === 'paid' ? 'text-green-500' : 'text-red-500'}`} value={o.payment_status || 'unpaid'} onChange={(e) => handleStatusUpdate(o.id, null, e.target.value)}>
                          <option value="unpaid">Unpaid</option>
                          <option value="pending_verification">Verify</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        {o.payment_proof ? (
                          <a href={getImg(o.payment_proof)} target="_blank" className="text-[10px] text-accent hover:underline border border-accent/30 rounded px-2 py-1">View</a>
                        ) : <span className="text-[10px] text-muted-foreground">-</span>}
                      </td>
                      <td className="p-4 text-right"><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('order', o.id)}><Trash2 size={12} /></Button></td>
                    </tr>
                  ))}</tbody></table></CardContent></Card>
            </TabsContent>

            <TabsContent value="messages">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.messages.map((m: any) => (
                  <Card key={m.id} className="relative group border-accent/10">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100" onClick={() => handleDelete('message', m.id)}><Trash2 size={12} /></Button>
                    <CardHeader><CardTitle className="text-md">{m.subject}</CardTitle></CardHeader>
                    <CardContent><p className="text-xs italic mb-4">"{m.message}"</p><div className="text-[10px] uppercase font-bold text-accent">{m.name} | {m.email}</div></CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="max-w-md border-accent/10">
                <CardHeader><CardTitle className="text-lg">Payment Configurations</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold">FonePay Master QR Code</label>
                    <div className="flex gap-4 items-end">
                      <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center p-2 bg-secondary/10 overflow-hidden">
                        {qrFile ? (
                          <img src={URL.createObjectURL(qrFile)} className="w-full h-full object-contain" />
                        ) : data.settings?.payment_qr ? (
                          <img src={getImg(data.settings.payment_qr)} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground text-center">No QR uploaded</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files?.[0] || null)} className="text-xs border p-1 rounded" />
                        <Button variant="outline" size="sm" onClick={handleSettingsSave} disabled={!qrFile}>Save QR Setup</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
