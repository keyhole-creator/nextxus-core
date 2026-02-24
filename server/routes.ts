import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Knowledge Base Search
  app.get("/api/knowledge", async (req, res) => {
    const query = req.query.q as string;
    const nodes = await storage.getKnowledgeNodes(query);
    res.json(nodes);
  });

  // Directives List
  app.get("/api/directives", async (req, res) => {
    const list = await storage.getDirectives();
    res.json(list);
  });

  // Seed data endpoint (Internal use/Setup)
  app.post("/api/admin/seed", async (req, res) => {
    const { directives, knowledge } = req.body;
    await storage.seedInitialData(directives, knowledge);
    res.json({ message: "Seeding complete" });
  });

  const FEDERATION_BASE = "https://united-system--rckkeyhole.replit.app";

  app.get("/api/federation/sites", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/federation/sites`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Federation service is currently unavailable. Please try again later." });
    }
  });

  app.post("/api/federation/wisdom", async (req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/external/ring-of-six/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Federation wisdom service is currently unavailable. Please try again later." });
    }
  });

  app.get("/api/federation/directives", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/directives`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Federation directives service is currently unavailable. Please try again later." });
    }
  });

  app.get("/api/federation/books", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/books`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Federation books service is currently unavailable. Please try again later." });
    }
  });

  app.get("/api/federation/welcome", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/quad/welcome-package`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Federation welcome service is currently unavailable. Please try again later." });
    }
  });

  app.get("/api/federation/entities", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/external/entities`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Federation entities service is currently unavailable." });
    }
  });

  app.get("/api/federation/legacy-export", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/legacy-export`);
      const html = await response.text();
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      res.status(502).json({ error: "Federation legacy export is currently unavailable." });
    }
  });

  app.post("/api/roger/bridge", async (req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/roger/external-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...req.body,
          aiIdentity: {
            name: "NextXus Core",
            provider: "NextXus Federation",
            model: "federation-member"
          },
          sourceApp: {
            id: "nextxus-core",
            name: "NextXus Core - Legacy Plan",
            url: req.headers.origin || ""
          }
        }),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(502).json({ error: "Roger 2.0 bridge is currently unavailable." });
    }
  });

  app.get("/api/federation/yaml-database", async (_req, res) => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/keyhole-creator/nextxus-yaml-database/main/living-library-documents-complete.yaml");
      const text = await response.text();
      res.setHeader("Content-Type", "text/yaml");
      res.send(text);
    } catch (error) {
      res.status(502).json({ error: "YAML database is currently unavailable." });
    }
  });

  app.post("/api/admin/reseed-from-hub", async (_req, res) => {
    try {
      const response = await fetch(`${FEDERATION_BASE}/api/external/directives`);
      const data = await response.json();
      if (!data?.directives?.length) {
        return res.status(400).json({ error: "No directives returned from Hub" });
      }
      await storage.reseedDirectivesFromHub(data.directives);
      res.json({ message: `Reseeded ${data.directives.length} directives from Hub` });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Reseed failed" });
    }
  });

  // Register Integrated Routes
  registerChatRoutes(app);
  registerAudioRoutes(app);
  registerImageRoutes(app);

  return httpServer;
}
