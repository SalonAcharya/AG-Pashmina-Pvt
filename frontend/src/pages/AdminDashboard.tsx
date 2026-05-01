import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2, Package, List, ShoppingBag, MessageSquare,
  BookOpen, Edit2, Trash2, Settings as SettingsIcon,
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle,
  Bell, X as XIcon, Clock, RotateCcw, Truck
} from "lucide-react";
import { CategoryForm, ProductForm, BlogForm } from "@/components/AdminForms";
import DeleteConfirm from "@/components/DeleteConfirm";
import { API_BASE_URL } from "@/lib/api";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-yellow-500 bg-yellow-500/10 border-yellow-400/30", icon: Clock },
  processing: { label: "Processing", color: "text-blue-500 bg-blue-500/10 border-blue-400/30", icon: RotateCcw },
  shipped: { label: "Shipped", color: "text-purple-500 bg-purple-500/10 border-purple-400/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-500 bg-green-500/10 border-green-400/30", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-500 bg-red-500/10 border-red-400/30", icon: XCircle },
};

const StepTracker = ({ status }: { status: OrderStatus }) => {
  const steps: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];
  const isCancelled = status === "cancelled";
  const currentIndex = isCancelled ? -1 : steps.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-3 max-w-md">
      {steps.map((step, i) => {
        const cfg = STATUS_CONFIG[step];
        const Icon = cfg.icon;
        const isActive = !isCancelled && i <= currentIndex;
        const isCurrentStep = !isCancelled && i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-1 flex-1`}>
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-accent bg-accent/20 text-accent" : "border-border text-muted-foreground"} ${isCurrentStep ? "ring-2 ring-accent/30 ring-offset-2 ring-offset-background" : ""}`}>
                <Icon size={12} />
              </div>
              <span className={`text-[8px] uppercase font-bold tracking-wider hidden sm:block ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                {cfg.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 rounded ${isActive && i < currentIndex ? "bg-accent" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Stock badge helper ────────────────────────────────────────────────────────
const StockBadge = ({ qty, threshold }: { qty: number; threshold: number }) => {
  if (qty <= 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
        <XCircle size={9} /> Out of Stock
      </span>
    );
  if (qty <= threshold)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-400/25">
        <AlertTriangle size={9} /> Low — {qty} left
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-400/25">
      <CheckCircle size={9} /> In Stock ({qty})
    </span>
  );
};

// ── Tab badge helper ──────────────────────────────────────────────────────────
const TabBadge = ({ count, isCleared }: { count: number; isCleared: boolean }) => {
  if (count <= 0 || isCleared) return null;
  return (
    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-lg bg-accent/20 text-[10px] font-bold text-accent border border-accent/20 px-1.5 min-w-[20px]">
      {count > 99 ? "99+" : count}
    </span>
  );
};

const AdminDashboard = () => {
  const { token, isAdmin } = useAuth();
  const [data, setData] = useState({
    orders: [],
    categories: [],
    products: [],
    messages: [],
    blogs: [],
    settings: {} as any,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<{ type: string; item: any } | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [notifications, setNotifications] = useState<{ id: number; type: "order" | "msg"; orderId?: number; msgId?: number; total?: string; method?: string; sender?: string; subject?: string; time: string }[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [orderUnread, setOrderUnread] = useState(0);
  const [msgUnread, setMsgUnread] = useState(0);
  const [activeTab, setActiveTab] = useState("products");
  const [clearedTabs, setClearedTabs] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: string;
    id: number | null;
    isDeleting: boolean;
  }>({
    open: false,
    type: "",
    id: null,
    isDeleting: false,
  });

  const safeJson = async (res: Response, fallback: any) => {
    if (!res.ok) return fallback;
    try { return await res.json(); } catch { return fallback; }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [o, c, p, m, b, s] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders?status=${selectedStatus}`, { headers }).then((r) => safeJson(r, [])),
        fetch(`${API_BASE_URL}/api/categories`).then((r) => safeJson(r, [])),
        fetch(`${API_BASE_URL}/api/products`).then((r) => safeJson(r, [])),
        fetch(`${API_BASE_URL}/api/contact-messages`, { headers }).then((r) => safeJson(r, [])),
        fetch(`${API_BASE_URL}/api/blog`).then((r) => safeJson(r, [])),
        fetch(`${API_BASE_URL}/api/settings`).then((r) => safeJson(r, {})),
      ]);
      setData({
        orders:     Array.isArray(o) ? o : [],
        categories: Array.isArray(c) ? c : [],
        products:   Array.isArray(p) ? p : [],
        messages:   Array.isArray(m) ? m : [],
        blogs:      Array.isArray(b) ? b : [],
        settings:   (s && typeof s === "object" && !Array.isArray(s)) ? s : {},
      });
    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, selectedStatus]);

  // ── WebSocket: listen for new orders & messages ──────────────────────
  useEffect(() => {
    if (!isAdmin) return;
    const ws = new WebSocket(API_BASE_URL.replace(/^https/, "wss").replace(/^http/, "ws"));

    ws.onopen = () => console.log("[WS] Admin connected");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "new_order") {
          const notif = {
            id: Date.now(),
            type: "order" as const,
            orderId: msg.orderId,
            total: msg.total,
            method: msg.paymentMethod,
            time: new Date(msg.timestamp).toLocaleTimeString(),
          };
          setNotifications((prev) => [notif, ...prev].slice(0, 20));
          setOrderUnread((c) => c + 1);
          toast(`🛍️ New Order #${String(msg.orderId).padStart(5, "0")}`, {
            description: `Rs.${msg.total} via ${msg.paymentMethod?.toUpperCase() || "COD"}`,
            action: { label: "View", onClick: fetchData },
            duration: 8000,
          });
        }

        if (msg.type === "new_message") {
          const notif = {
            id: Date.now() + 1,
            type: "msg" as const,
            msgId: msg.messageId,
            sender: msg.name,
            subject: msg.subject,
            time: new Date(msg.timestamp).toLocaleTimeString(),
          };
          setNotifications((prev) => [notif, ...prev].slice(0, 20));
          setMsgUnread((c) => c + 1);
          toast(`📬 Message from ${msg.name}`, {
            description: msg.subject || "(no subject)",
            action: { label: "View", onClick: fetchData },
            duration: 8000,
          });
        }
      } catch (_) {}
    };

    ws.onerror = (err) => console.warn("[WS] Error", err);

    return () => ws.close();
  }, [isAdmin]);

  const handleDeleteTrigger = (type: string, id: number) => {
    setDeleteDialog({ open: true, type, id, isDeleting: false });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteDialog;
    if (!id) return;

    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      const endpoint =
        type === "message" ? "contact-messages" : type === "blog" ? "blog" : type === "category" ? "categories" : type + "s";
      const res = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchData();
        toast.success("Deleted!");
        setDeleteDialog({ open: false, type: "", id: null, isDeleting: false });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleStatusUpdate = async (
    id: number,
    status: string | null,
    paymentStatus: string | null
  ) => {
    try {
      const payload: any = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.payment_status = paymentStatus;

      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(
          status === "cancelled"
            ? "Order cancelled — stock restored automatically"
            : "Order updated"
        );
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const handleSettingsSave = async () => {
    try {
      let finalUrl = undefined;
      if (qrFile) {
        const formData = new FormData();
        formData.append("images", qrFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        
        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Upload failed");
        }
        
        finalUrl = uploadData.urls[0];
      }
      
      if (finalUrl) {
        const res = await fetch(`${API_BASE_URL}/api/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ payment_qr: finalUrl }),
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to update settings");
        }
        
        toast.success("Settings saved");
        fetchData();
        setQrFile(null);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Error saving settings");
    }
  };

  const pendingOrders = data.orders.filter((o: any) => o.status === "pending").length;
  const unreadMessagesCount = data.messages.filter((m: any) => !m.is_read).length;

  const handleTabChange = async (value: string) => {
    // If the tab being clicked has an active badge count and hasn't been cleared yet
    // we clear the badge but DO NOT switch the tab yet (two-click activation)
    const hasOrdersBadge = value === "orders" && pendingOrders > 0;
    const hasMessagesBadge = value === "messages" && unreadMessagesCount > 0;
    
    if ((hasOrdersBadge || hasMessagesBadge) && !clearedTabs.includes(value)) {
      // Clear the local badge
      setClearedTabs(prev => [...prev, value]);
      
      // If it's messages, we also tell the backend to mark all as read
      if (value === "messages") {
        try {
          await fetch(`${API_BASE_URL}/api/contact-messages/read-all`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          });
          // Note: we don't fetchData() here to avoid resetting the counts instantly
          // which might be jarring. We'll refresh after we actually enter the tab.
        } catch (err) {
          console.error("Failed to mark messages as read", err);
        }
      }
      return; // Stop here, don't switch tab
    }

    // Normal switch (or second click)
    setActiveTab(value);
    
    // Clear unread counts for the bell too
    if (value === "orders") setOrderUnread(0);
    if (value === "messages") {
      setMsgUnread(0);
      fetchData(); // Refresh to make sure everything is sync'd
    }
  };

  const getImg = (url: string) =>
    url?.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  if (!isAdmin)
    return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-12 relative">
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-card border-accent/20">
            <CardContent className="p-6">
              {editing.type === "product" && (
                <ProductForm
                  categories={data.categories}
                  editData={editing.item}
                  onAdd={fetchData}
                  onCancel={() => setEditing(null)}
                />
              )}
              {editing.type === "category" && (
                <CategoryForm
                  editData={editing.item}
                  onAdd={fetchData}
                  onCancel={() => setEditing(null)}
                />
              )}
              {editing.type === "blog" && (
                <BlogForm
                  editData={editing.item}
                  onAdd={fetchData}
                  onCancel={() => setEditing(null)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display text-4xl">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifPanel(!showNotifPanel); setOrderUnread(0); setMsgUnread(0); }}
                className="relative p-2 rounded-full hover:bg-muted/40 transition-colors"
                title="Notifications"
              >
                <Bell size={20} />
                {/* Two separate badges for orders and messages */}
                {orderUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {orderUnread > 9 ? "9+" : orderUnread}
                  </span>
                )}
                {msgUnread > 0 && (
                  <span className="absolute -top-0.5 left-4 w-5 h-5 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {msgUnread > 9 ? "9+" : msgUnread}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifPanel && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <p className="text-xs font-bold uppercase tracking-wider">Notifications</p>
                    <div className="flex gap-2">
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                          Clear All
                        </button>
                      )}
                      <button onClick={() => setShowNotifPanel(false)}>
                        <XIcon size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                        <Bell size={24} className="text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => { fetchData(); setShowNotifPanel(false); }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            n.type === "order" ? "bg-accent/15" : "bg-blue-500/15"
                          }`}>
                            {n.type === "order"
                              ? <ShoppingBag size={14} className="text-accent" />
                              : <MessageSquare size={14} className="text-blue-500" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            {n.type === "order" ? (
                              <>
                                <p className="text-xs font-bold">New Order #{String(n.orderId).padStart(5, "0")}</p>
                                <p className="text-[10px] text-muted-foreground">Rs.{n.total} · {n.method?.toUpperCase()} · {n.time}</p>
                              </>
                            ) : (
                              <>
                                <p className="text-xs font-bold">Message from {n.sender}</p>
                                <p className="text-[10px] text-muted-foreground">{n.subject} · {n.time}</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button variant="luxury" onClick={fetchData}>
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-accent" />
          </div>
        ) : (
          <Tabs value={activeTab} className="space-y-6" onValueChange={handleTabChange}>
            <TabsList className="bg-card border w-full justify-start p-1 gap-1 overflow-x-auto">
              <TabsTrigger value="products" className="gap-2">
                <Package size={14} /> Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <List size={14} /> Categories
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 flex-grow sm:flex-grow-0 justify-start sm:justify-center">
                <ShoppingBag size={14} /> 
                <span>Orders</span>
                <TabBadge count={pendingOrders} isCleared={clearedTabs.includes("orders")} />
              </TabsTrigger>
              <TabsTrigger value="blogs" className="gap-2 flex-grow sm:flex-grow-0 justify-start sm:justify-center">
                <BookOpen size={14} /> Blogs
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 flex-grow sm:flex-grow-0 justify-start sm:justify-center">
                <MessageSquare size={14} /> 
                <span>Messages</span>
                <TabBadge count={unreadMessagesCount} isCleared={clearedTabs.includes("messages")} />
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <SettingsIcon size={14} /> Settings
              </TabsTrigger>
            </TabsList>

            {/* ── Products Tab ─────────────────────────────────────────────── */}
            <TabsContent value="products">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-accent/20">
                  <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductForm categories={data.categories} onAdd={fetchData} />
                  </CardContent>
                </Card>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                  {data.products.map((p: any) => (
                    <Card key={p.id} className="overflow-hidden group h-fit">
                      <div className="aspect-square relative bg-muted">
                        {p.images?.[0] ? (
                          <img
                            src={getImg(p.images[0])}
                            className="w-full h-full object-cover"
                            alt={p.name}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px]">
                            No image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7"
                            onClick={() => setEditing({ type: "product", item: p })}
                          >
                            <Edit2 size={12} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleDeleteTrigger("product", p.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3 space-y-1.5">
                        <div className="flex justify-between items-start text-sm font-bold">
                          <span className="truncate mr-1">{p.name}</span>
                          <span className="text-accent shrink-0">Rs.{p.sale_price}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {p.category_name}
                        </p>
                        {/* ── Stock Badge ── */}
                        <StockBadge
                          qty={p.stock_quantity ?? 0}
                          threshold={p.low_stock_threshold ?? 5}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Blogs Tab ────────────────────────────────────────────────── */}
            <TabsContent value="blogs">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-accent/20">
                  <CardHeader>
                    <CardTitle>Write Article</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BlogForm onAdd={fetchData} />
                  </CardContent>
                </Card>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {data.blogs.map((b: any) => (
                    <Card key={b.id} className="group overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        {b.featured_image ? (
                          <img
                            src={getImg(b.featured_image)}
                            className="w-full h-full object-cover"
                            alt={b.title}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px]">
                            No image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7"
                            onClick={() => setEditing({ type: "blog", item: b })}
                          >
                            <Edit2 size={12} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleDeleteTrigger("blog", b.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-display text-md mb-2">{b.title}</h3>
                        <div className="flex gap-2 text-[10px] text-muted-foreground italic mb-1">
                          <span>{b.origin}</span>
                          <span>|</span>
                          <span>{b.fiber}</span>
                        </div>
                        <p className="text-xs line-clamp-2 text-muted-foreground">{b.excerpt}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Categories Tab ───────────────────────────────────────────── */}
            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-accent/20">
                  <CardHeader>
                    <CardTitle>Add Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryForm onAdd={fetchData} />
                  </CardContent>
                </Card>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {data.categories.map((c: any) => (
                    <Card key={c.id} className="group overflow-hidden relative border-accent/10">
                      <div className="h-32 bg-muted relative">
                        {c.image ? (
                          <img
                            src={getImg(c.image)}
                            className="w-full h-full object-cover"
                            alt={c.name}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px]">
                            No image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7"
                            onClick={() => setEditing({ type: "category", item: c })}
                          >
                            <Edit2 size={12} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleDeleteTrigger("category", c.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
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

            {/* ── Orders Tab ───────────────────────────────────────────────── */}
            <TabsContent value="orders">
              <Card className="border-accent/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl">Manage Orders</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Filter:</span>
                    <select
                      className="text-xs border rounded-md px-2 py-1 bg-background"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left bg-muted/30">
                        <th className="p-4 w-6"></th>
                        <th className="p-4">ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4 text-right">Total</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Payment</th>
                        <th className="p-4 text-center">Proof</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.orders as any[]).map((o: any) => (
                        <>
                          {/* ── Main Order Row ── */}
                          <tr
                            key={o.id}
                            className={`border-b hover:bg-muted/30 cursor-pointer transition-colors ${
                              expandedOrder === o.id ? "bg-muted/20" : ""
                            }`}
                            onClick={() =>
                              setExpandedOrder(expandedOrder === o.id ? null : o.id)
                            }
                          >
                            <td className="p-4 text-muted-foreground">
                              {expandedOrder === o.id ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </td>
                            <td className="p-4 font-mono text-xs">
                              #{String(o.id).padStart(5, "0")}
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-bold">{o.user_name}</p>
                                <p className="text-[10px]">
                                  {new Date(o.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <p className="font-bold">Rs.{o.total_amount}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">
                                {o.payment_method || "cod"}
                              </p>
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <select
                                className={`text-[10px] uppercase font-bold border rounded px-1 py-1 bg-transparent cursor-pointer ${
                                  o.status === "cancelled"
                                    ? "text-destructive border-destructive/40"
                                    : o.status === "shipped" || o.status === "delivered"
                                    ? "text-green-600 border-green-400/40"
                                    : "text-foreground"
                                }`}
                                value={o.status || "pending"}
                                onChange={(e) =>
                                  handleStatusUpdate(o.id, e.target.value, null)
                                }
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <select
                                className={`text-[10px] uppercase font-bold border rounded px-1 py-1 bg-transparent cursor-pointer ${
                                  o.payment_status === "paid"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                                value={o.payment_status || "unpaid"}
                                onChange={(e) =>
                                  handleStatusUpdate(o.id, null, e.target.value)
                                }
                              >
                                <option value="unpaid">Unpaid</option>
                                <option value="pending_verification">Verify</option>
                                <option value="paid">Paid</option>
                              </select>
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              {o.payment_proof ? (
                                <a
                                  href={getImg(o.payment_proof)}
                                  target="_blank"
                                  className="text-[10px] text-accent hover:underline border border-accent/30 rounded px-2 py-1"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">-</span>
                              )}
                            </td>
                            <td
                              className="p-4 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleDeleteTrigger("order", o.id)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </td>
                          </tr>

                          {/* ── Expanded Items Row ── */}
                          {expandedOrder === o.id && o.items && o.items.length > 0 && (
                            <tr key={`${o.id}-items`} className="bg-muted/10 border-b">
                              <td colSpan={8} className="px-8 py-4">
                                <div className="mb-6 bg-muted/20 p-4 rounded-lg border border-border/50">
                                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-3">
                                    Current Status Progress
                                  </p>
                                  <StepTracker status={o.status as OrderStatus} />
                                </div>
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-3">
                                  Order Items ({o.items.length})
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {o.items.map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center gap-3 bg-card border border-border rounded-lg p-2 min-w-[220px] max-w-[280px]"
                                    >
                                      {/* Product thumbnail */}
                                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                                        {item.product_images?.[0] ? (
                                          <img
                                            src={getImg(item.product_images[0])}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                            <Package size={16} className="text-muted-foreground" />
                                          </div>
                                        )}
                                      </div>
                                      {/* Product info */}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate">
                                          {item.product_name}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                          {item.size && (
                                            <span className="text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded uppercase font-bold">
                                              {item.size}
                                            </span>
                                          )}
                                          {item.color && (
                                            <span className="text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded uppercase font-bold">
                                              {item.color}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                          <span className="text-[10px] text-muted-foreground">
                                            Qty:{" "}
                                            <span className="font-bold text-foreground">
                                              {item.quantity}
                                            </span>
                                          </span>
                                          <span className="text-[10px] font-bold text-accent">
                                            Rs.{item.price}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Messages Tab ─────────────────────────────────────────────── */}
            <TabsContent value="messages">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.messages.map((m: any) => (
                  <Card key={m.id} className="relative group border-accent/10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100"
                      onClick={() => handleDeleteTrigger("message", m.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                    <CardHeader>
                      <CardTitle className="text-md">{m.subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs italic mb-4">"{m.message}"</p>
                      <div className="text-[10px] uppercase font-bold text-accent">
                        {m.name} | {m.email}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── Settings Tab ─────────────────────────────────────────────── */}
            <TabsContent value="settings">
              <Card className="max-w-md border-accent/10">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Configurations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold">FonePay Master QR Code</label>
                    <div className="flex gap-4 items-end">
                      <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center p-2 bg-secondary/10 overflow-hidden">
                        {qrFile ? (
                          <img
                            src={URL.createObjectURL(qrFile)}
                            className="w-full h-full object-contain"
                            alt="QR preview"
                          />
                        ) : data.settings?.payment_qr ? (
                          <img
                            src={getImg(data.settings.payment_qr)}
                            className="w-full h-full object-contain"
                            alt="QR code"
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground text-center">
                            No QR uploaded
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                          className="text-xs border p-1 rounded"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSettingsSave}
                          disabled={!qrFile}
                        >
                          Save QR Setup
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <DeleteConfirm
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onConfirm={confirmDelete}
        title={`Delete ${deleteDialog.type}?`}
        description={`Are you sure you want to delete this ${deleteDialog.type}? This action cannot be undone.`}
        loading={deleteDialog.isDeleting}
      />
    </div>
  );
};

export default AdminDashboard;
