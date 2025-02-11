import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function OrderConfirmation() {
  return (
    <div className="max-w-md mx-auto text-center">
      <Card className="p-6">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. We'll send you an email with your order details shortly.
        </p>
        <Link href="/products">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </Card>
    </div>
  );
}
