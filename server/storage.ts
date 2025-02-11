import { db } from "./db";
import { eq } from "drizzle-orm";
import { type Product, type Category, type CartItem, type Order } from "@shared/schema";
import { products, categories, cartItems, orders } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(sessionId: string, productId: number, quantity: number): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  createOrder(order: Omit<Order, "id">): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    console.log("Executing getProductsByCategory with categoryId:", categoryId);
    const filteredProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId));
    console.log("SQL Result:", filteredProducts);
    return filteredProducts;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(sessionId: string, productId: number, quantity: number): Promise<CartItem> {
    const [item] = await db.insert(cartItems)
      .values({ sessionId, productId, quantity })
      .returning();
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    if (!updated) throw new Error("Cart item not found");
    return updated;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async createOrder(order: Omit<Order, "id">): Promise<Order> {
    const [newOrder] = await db.insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }
}

// Initialize the database with sample data
async function initializeData() {
  const categoriesData = [
    { name: "Fruits & Vegetables", image: "https://images.unsplash.com/photo-1558770147-a0e2842c5ea1" },
    { name: "Dairy & Eggs", image: "https://images.unsplash.com/photo-1558770147-68c0607adb26" },
    { name: "Bakery", image: "https://images.unsplash.com/photo-1558770147-d2a384e1ad85" },
    { name: "Beverages", image: "https://images.unsplash.com/photo-1524871729950-c4e886edc1f9" },
  ];

  const existingCategories = await db.select().from(categories);
  if (existingCategories.length === 0) {
    await db.insert(categories).values(categoriesData);
  }

  const productsData = [
    { name: "Fresh Produce Bundle", description: "Assorted fresh vegetables", price: "15.99", image: "https://images.unsplash.com/photo-1556767576-5ec41e3239ea", categoryId: 1 },
    { name: "Organic Eggs", description: "Farm fresh eggs", price: "5.99", image: "https://images.unsplash.com/photo-1584680226833-0d680d0a0794", categoryId: 2 },
    { name: "Artisan Bread", description: "Freshly baked bread", price: "4.99", image: "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41", categoryId: 3 },
    { name: "Fresh Milk", description: "Whole milk", price: "3.99", image: "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0", categoryId: 2 },
    { name: "Orange Juice", description: "Fresh squeezed", price: "6.99", image: "https://images.unsplash.com/photo-1526470498-9ae73c665de8", categoryId: 4 },
  ];

  const existingProducts = await db.select().from(products);
  if (existingProducts.length === 0) {
    await db.insert(products).values(productsData);
  }
}

export const storage = new DatabaseStorage();
initializeData().catch(console.error);