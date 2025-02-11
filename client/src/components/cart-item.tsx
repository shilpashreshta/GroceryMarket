import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem, Product } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CartItemProps {
  item: CartItem;
  product: Product;
}

export default function CartItemCard({ item, product }: CartItemProps) {
  const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();

  const updateQuantity = useMutation({
    mutationFn: async (quantity: number) => {
      await apiRequest("PUT", `/api/cart/${item.id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">${product.price}</p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity.mutate(Math.max(0, item.quantity - 1))}
              disabled={updateQuantity.isPending}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity.mutate(item.quantity + 1)}
              disabled={updateQuantity.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="ml-auto"
              onClick={() => removeItem.mutate()}
              disabled={removeItem.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
