import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import CategoryBanner from "@/components/category-banner";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-muted rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative h-64 rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556767576-5ec41e3239ea"
          alt="Fresh groceries"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl font-bold text-white mb-4">
            Fresh Groceries Delivered
          </h1>
          <p className="text-white/90 mb-6 max-w-md">
            Shop from our wide selection of fresh, high-quality groceries
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories?.map((category) => (
            <CategoryBanner key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
}
