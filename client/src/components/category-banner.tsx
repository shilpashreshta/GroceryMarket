import { Category } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryBannerProps {
  category: Category;
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <a className="block">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0 relative">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">{category.name}</h3>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
