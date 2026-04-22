import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Search, Package, Clock, CheckCircle2, Truck, XCircle, RotateCcw, 
  ChevronRight, ArrowLeft, ShoppingBag 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-yellow-500 bg-yellow-500/10 border-yellow-400/30", icon: Clock },
  processing: { label: "Processing", color: "text-blue-500 bg-blue-500/10 border-blue-400/30", icon: RotateCcw },
  shipped: { label: "Shipped", color: "text-purple-500 bg-purple-500/10 border-purple-400/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-500 bg-green-500/10 border-green-400/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-500 bg-red-500/10 border-red-400/30", icon: XCircle },
};

const StepTracker = ({ status }: { status: OrderStatus }) => {
  const steps: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];
  const isCancelled = status === "cancelled";
  const currentIndex = isCancelled ? -1 : steps.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-6 max-w-xl mx-auto">
      {steps.map((step, i) => {
        const cfg = STATUS_CONFIG[step];
        const Icon = cfg.icon;
        const isActive = !isCancelled && i <= currentIndex;
        const isCurrentStep = !isCancelled && i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-2 flex-1`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-accent bg-accent/20 text-accent" : "border-border text-muted-foreground"} ${isCurrentStep ? "ring-4 ring-accent/20" : ""}`}>
                <Icon size={16} />
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                {cfg.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 mb-6 rounded-full transition-colors ${isActive && i < currentIndex ? "bg-accent" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!orderId) return;
    
    setIsLoading(true);
    setOrder(null);
    try {
      // We use a specific tracking endpoint that doesn't require full auth, or just use the normal one if logged in
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId.replace("#", "")}/track`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Order not found. Please check the ID.");
        throw new Error("Could not fetch order status.");
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl md:text-5xl">Track Your Order</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your order number to see the current progress and estimated delivery.
          </p>
        </div>

        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Order ID (e.g. #00123)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-accent/10 focus:border-accent transition-all text-lg font-mono"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Track Order"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {order && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-accent/10 overflow-hidden">
              <div className="p-6 sm:p-8 bg-muted/30 border-b border-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Order Found</p>
                    <h2 className="text-2xl font-mono">#{String(order.id).padStart(5, '0')}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Status</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider">
                      {STATUS_CONFIG[order.status as OrderStatus]?.icon && (
                        <span className="shrink-0">
                          {(() => {
                            const Icon = STATUS_CONFIG[order.status as OrderStatus].icon;
                            return <Icon size={14} />;
                          })()}
                        </span>
                      )}
                      {order.status}
                    </div>
                  </div>
                </div>

                <StepTracker status={order.status as OrderStatus} />
              </div>

              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-accent font-bold uppercase text-[10px] tracking-widest">
                      <ShoppingBag size={14} />
                      Order Details
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Placed on: <span className="text-muted-foreground font-medium">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span></p>
                      <p className="text-sm">Total items: <span className="text-muted-foreground font-medium">{order.items?.length || 0}</span></p>
                      <p className="text-sm font-bold">Total Amount: <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">Rs.{order.total_amount}</span></p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-accent font-bold uppercase text-[10px] tracking-widest">
                      <Truck size={14} />
                      Shipping
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {order.shipping_address || "Standard shipping to your registered address."}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => navigate("/shop")}>
                    <ArrowLeft size={16} /> Continue Shopping
                  </Button>
                  <Button variant="outline" className="gap-2 border-accent/20 text-accent hover:bg-accent/5" onClick={() => navigate("/dashboard")}>
                    Go to My Dashboard <ChevronRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!order && !isLoading && (
          <div className="text-center py-12 opacity-50">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-sm">Your order tracking information will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
