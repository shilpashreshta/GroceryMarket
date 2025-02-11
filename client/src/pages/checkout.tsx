import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";

const checkoutSchema = z.object({
  email: z.string().email(),
  address: z.string().min(10, "Please enter your full address"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();

  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      address: "",
    },
  });

  const cartTotal = cartItems?.reduce((total, item) => {
    const product = products?.find((p) => p.id === item.productId);
    return total + (product ? parseFloat(product.price) * item.quantity : 0);
  }, 0) || 0;

  const placeOrder = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      await apiRequest("POST", "/api/orders", {
        ...data,
        sessionId,
        total: cartTotal,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      setLocation("/order-confirmation");
    },
  });

  if (!cartItems?.length) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map((item) => {
              const product = products?.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {product.name} x {item.quantity}
                  </span>
                  <span>${(parseFloat(product.price) * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => placeOrder.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={placeOrder.isPending}>
              Place Order
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
