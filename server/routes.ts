import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/category/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      console.log("Filtering products for category:", categoryId);

      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const products = await storage.getProductsByCategory(categoryId);
      console.log("Found products:", products.length);

      if (!products.length) {
        return res.status(404).json({ message: "No products found for this category" });
      }

      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/cart/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const items = await storage.getCartItems(sessionId);
    res.json(items);
  });

  app.post("/api/cart/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const { productId, quantity } = req.body;
    const item = await storage.addToCart(sessionId, productId, quantity);
    res.json(item);
  });

  app.put("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    const item = await storage.updateCartItem(id, quantity);
    res.json(item);
  });

  app.delete("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.removeFromCart(id);
    res.status(204).end();
  });

  app.post("/api/orders", async (req, res) => {
    const orderData = insertOrderSchema.parse(req.body);
    const order = await storage.createOrder(orderData);
    res.json(order);
  });

  const httpServer = createServer(app);
  return httpServer;
}