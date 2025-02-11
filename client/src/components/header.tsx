import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CartItem } from "@shared/schema";

export default function Header() {
  const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: [`/api/cart/${sessionId}`]
  });

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">FreshMart</a>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/products">
            <a className="text-foreground/80 hover:text-foreground">Products</a>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>{cartItems?.length || 0}</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
