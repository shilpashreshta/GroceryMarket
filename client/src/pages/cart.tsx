import { useQuery } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import CartItemCard from "@/components/cart-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ShoppingBasket } from "lucide-react";

export default function Cart() {
  const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);

  const { data: cartItems, isLoading: cartLoading } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (cartLoading || productsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="text-center py-12">
        <ShoppingBasket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some items to your cart to get started
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const cartTotal = cartItems.reduce((total, item) => {
    const product = products?.find((p) => p.id === item.productId);
    return total + (product ? parseFloat(product.price) * item.quantity : 0);
  }, 0);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {cartItems.map((item) => {
          const product = products?.find((p) => p.id === item.productId);
          if (!product) return null;
          return <CartItemCard key={item.id} item={item} product={product} />;
        })}
      </div>
      <div>
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
