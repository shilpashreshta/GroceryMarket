import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { useLocation, useSearch } from "wouter";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const API_BASE_URL = window.location.origin;

export default function Products() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [searchParams] = useSearch();
  const categoryId = new URLSearchParams(searchParams).get("category");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: categoryId ? [`/api/products/category/${categoryId}`] : ["/api/products"],
    queryFn: async () => {
      const url = categoryId ? `${API_BASE_URL}/api/products/category/${categoryId}` : `${API_BASE_URL}/api/products`;
      console.log("Fetching products from:", url);

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch products:", errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      return data;
    }
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (productsLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-full max-w-sm animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs
          value={categoryId || "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setLocation("/products");
            } else {
              setLocation(`/products?category=${value}`);
            }
          }}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">All</TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id.toString()}
                className="flex-1 sm:flex-none"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
}