import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  User,
  Mail,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:5000";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "unpaid" | "pending_verification" | "paid";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-yellow-500 bg-yellow-500/10 border-yellow-400/30", icon: Clock },
  processing: { label: "Processing", color: "text-blue-500 bg-blue-500/10 border-blue-400/30", icon: RotateCcw },
  shipped: { label: "Shipped", color: "text-purple-500 bg-purple-500/10 border-purple-400/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-500 bg-green-500/10 border-green-400/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-500 bg-red-500/10 border-red-400/30", icon: XCircle },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  unpaid: { label: "Unpaid", color: "text-red-500 bg-red-500/10 border-red-400/30" },
  pending_verification: { label: "Verifying", color: "text-yellow-500 bg-yellow-500/10 border-yellow-400/30" },
  paid: { label: "Paid", color: "text-green-500 bg-green-500/10 border-green-400/30" },
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.color}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
  const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG.unpaid;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const StepTracker = ({ status }: { status: OrderStatus }) => {
  const steps: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];
  const isCancelled = status === "cancelled";
  const currentIndex = isCancelled ? -1 : steps.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-3">
      {steps.map((step, i) => {
        const cfg = STATUS_CONFIG[step];
        const Icon = cfg.icon;
        const isActive = !isCancelled && i <= currentIndex;
        const isCurrentStep = !isCancelled && i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-1 flex-1 ${i === steps.length - 1 ? "" : ""}`}>
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
      {isCancelled && (
        <div className="ml-auto">
          <OrderStatusBadge status="cancelled" />
        </div>
      )}
    </div>
  );
};

const MyDashboard = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders?mine=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load your orders");
    } finally {
      setIsLoading(false);
    }
  };

  const getImg = (url: string) =>
    url?.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">My Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your orders and account details</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="self-start sm:self-auto">
            Sign Out
          </Button>
        </div>

        {/* ── Account Info Card ── */}
        <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                <User size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Mail size={12} />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
              {user?.hasPassword !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => navigate("/change-password")}
                >
                  <KeyRound size={12} />
                  Change Password
                </Button>
              )}
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{orders.length}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Total Orders</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-2xl font-bold text-green-500">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">Rs.{totalSpent.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Orders Section ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl flex items-center gap-2">
              <ShoppingBag size={18} className="text-accent" />
              My Orders
            </h2>
            <Button variant="ghost" size="sm" onClick={fetchOrders} className="text-xs gap-1">
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin h-8 w-8 text-accent" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="border-dashed border-accent/20">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Package size={28} className="text-accent" />
                </div>
                <p className="font-bold text-lg">No orders yet</p>
                <p className="text-sm text-muted-foreground">Start shopping to see your orders here!</p>
                <Button variant="luxury" className="mt-2" onClick={() => navigate("/shop")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <Card key={o.id} className="border-accent/10 overflow-hidden">
                  {/* ── Order Header (always visible) ── */}
                  <div
                    className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 text-muted-foreground">
                        {expandedOrder === o.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{String(o.id).padStart(5, "0")}
                          </span>
                          <OrderStatusBadge status={o.status as OrderStatus} />
                          <PaymentBadge status={o.payment_status as PaymentStatus} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(o.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                          {" · "}
                          {o.items?.length || 0} item{o.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-sm">Rs.{parseFloat(o.total_amount).toLocaleString()}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">{o.payment_method || "cod"}</p>
                    </div>
                  </div>

                  {/* ── Expanded content ── */}
                  {expandedOrder === o.id && (
                    <div className="border-t border-border">
                      {/* Status Tracker */}
                      <div className="px-5 pt-4 pb-2">
                        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground mb-2">
                          Order Progress
                        </p>
                        <StepTracker status={o.status as OrderStatus} />
                      </div>

                      {/* Items */}
                      {o.items && o.items.length > 0 && (
                        <div className="px-5 py-4 border-t border-border">
                          <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground mb-3">
                            Items Ordered
                          </p>
                          <div className="space-y-3">
                            {o.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border shrink-0">
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
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">{item.product_name}</p>
                                  <div className="flex gap-2 mt-0.5 flex-wrap">
                                    {item.size && (
                                      <span className="text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase">
                                        {item.size}
                                      </span>
                                    )}
                                    {item.color && (
                                      <span className="text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase">
                                        {item.color}
                                      </span>
                                    )}
                                    <span className="text-[9px] text-muted-foreground">
                                      Qty: <strong>{item.quantity}</strong>
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm font-bold text-accent shrink-0">
                                  Rs.{item.price}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shipping & Payment Summary */}
                      <div className="px-5 py-4 border-t border-border bg-muted/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground mb-1">
                            Shipping Address
                          </p>
                          <p className="text-xs text-muted-foreground">{o.shipping_address || "—"}</p>
                        </div>
                        <div className="space-y-1 text-xs sm:text-right">
                          <div className="flex justify-between sm:justify-end gap-4">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>Rs.{(parseFloat(o.total_amount) - parseFloat(o.vat_amount || 0) - parseFloat(o.delivery_fee || 0)).toFixed(2)}</span>
                          </div>
                          {parseFloat(o.vat_amount) > 0 && (
                            <div className="flex justify-between sm:justify-end gap-4">
                              <span className="text-muted-foreground">VAT (13%)</span>
                              <span>Rs.{parseFloat(o.vat_amount).toFixed(2)}</span>
                            </div>
                          )}
                          {parseFloat(o.delivery_fee) > 0 && (
                            <div className="flex justify-between sm:justify-end gap-4">
                              <span className="text-muted-foreground">Delivery</span>
                              <span>Rs.{parseFloat(o.delivery_fee).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between sm:justify-end gap-4 font-bold border-t border-border pt-1 mt-1">
                            <span>Total</span>
                            <span className="text-accent">Rs.{parseFloat(o.total_amount).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;
