import { users, type User, type InsertUser, directives, knowledgeNodes, type Directive, type KnowledgeNode, type InsertDirective, type InsertKnowledgeNode } from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Knowledge Base
  getKnowledgeNodes(query?: string): Promise<KnowledgeNode[]>;
  createKnowledgeNode(node: InsertKnowledgeNode): Promise<KnowledgeNode>;
  
  // Directives
  getDirectives(): Promise<Directive[]>;
  createDirective(directive: InsertDirective): Promise<Directive>;
  
  // Bulk seed
  seedInitialData(directives: InsertDirective[], knowledge: InsertKnowledgeNode[]): Promise<void>;
  reseedDirectivesFromHub(hubDirectives: any[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getKnowledgeNodes(query?: string): Promise<KnowledgeNode[]> {
    if (!query) {
      return await db.select().from(knowledgeNodes);
    }
    const searchTerm = `%${query}%`;
    return await db.select().from(knowledgeNodes).where(
      or(
        ilike(knowledgeNodes.topic, searchTerm),
        ilike(knowledgeNodes.content, searchTerm),
        sql`${knowledgeNodes.tags}::text ilike ${searchTerm}`
      )
    );
  }

  async createKnowledgeNode(node: InsertKnowledgeNode): Promise<KnowledgeNode> {
    const [newNode] = await db.insert(knowledgeNodes).values(node).returning();
    return newNode;
  }

  async getDirectives(): Promise<Directive[]> {
    return await db.select().from(directives);
  }

  async createDirective(directive: InsertDirective): Promise<Directive> {
    const [newDirective] = await db.insert(directives).values(directive).returning();
    return newDirective;
  }

  async seedInitialData(directiveList: InsertDirective[], knowledgeList: InsertKnowledgeNode[]): Promise<void> {
    const existing = await db.select().from(directives).limit(1);
    if (existing.length > 0) return;

    if (directiveList.length > 0) {
      await db.insert(directives).values(directiveList);
    }
    if (knowledgeList.length > 0) {
      await db.insert(knowledgeNodes).values(knowledgeList);
    }
  }

  async reseedDirectivesFromHub(hubDirectives: any[]): Promise<void> {
    await db.delete(directives);
    const mapped = hubDirectives.map((d: any) => ({
      directiveId: d.code || `DIR-${String(d.id).padStart(3, '0')}`,
      title: d.title,
      content: d.description,
      volume: d.volume || null,
      volumeTitle: d.volumeTitle || null,
    }));
    for (let i = 0; i < mapped.length; i += 50) {
      await db.insert(directives).values(mapped.slice(i, i + 50));
    }
  }
}

export const storage = new DatabaseStorage();
