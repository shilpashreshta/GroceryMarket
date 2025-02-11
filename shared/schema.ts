import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  image: text("image").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  sessionId: text("session_id").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  total: decimal("total").notNull(),
});

export const insertProductSchema = createInsertSchema(products);
export const insertCategorySchema = createInsertSchema(categories);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
