import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, ShoppingBag, List, Package } from "lucide-react";
import { CategoryForm, ProductForm } from "@/components/AdminForms";

const AdminDashboard = () => {
  const { user, token, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, catsRes, productsRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/products"),
      ]);
      
      const ordersData = await ordersRes.json();
      const catsData = await catsRes.json();
      const productsData = await productsRes.json();
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your shop, products, and orders</p>
          </div>
          <Button variant="luxury" onClick={fetchData}>Refresh Data</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-accent" />
          </div>
        ) : (
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag size={16} /> Live Orders
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <List size={16} /> Categories
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package size={16} /> Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="py-3 px-4 font-medium min-w-[100px]">Order ID</th>
                          <th className="py-3 px-4 font-medium">Customer</th>
                          <th className="py-3 px-4 font-medium">Total</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                          <th className="py-3 px-4 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4">#{order.id}</td>
                            <td className="py-3 px-4">{order.user_name}</td>
                            <td className="py-3 px-4">${order.total_amount}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 bg-card border-border">
                  <CardHeader>
                    <CardTitle>Add Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryForm onAdd={fetchData} />
                  </CardContent>
                </Card>
                <Card className="md:col-span-2 bg-card border-border">
                  <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map((cat: any) => (
                        <li key={cat.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/20">
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{cat.slug}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 bg-card border-border">
                  <CardHeader>
                    <CardTitle>New Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductForm categories={categories} onAdd={fetchData} />
                  </CardContent>
                </Card>
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product: any) => (
                      <Card key={product.id} className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative overflow-hidden bg-muted">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-display text-lg mb-1 truncate">{product.name}</h3>
                          <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider">{product.category_name}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">${product.price}</span>
                            <span className="text-xs text-muted-foreground">Qty: {product.stock_quantity}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
