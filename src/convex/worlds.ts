import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorld = mutation({
  args: {
    name: v.string(),
    seed: v.optional(v.number()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const worldId = await ctx.db.insert("worlds", {
      name: args.name,
      ownerId: userId,
      seed: args.seed ?? Math.floor(Math.random() * 1000000),
      isPublic: args.isPublic ?? false,
    });

    // Create initial player data
    await ctx.db.insert("players", {
      userId,
      worldId,
      position: { x: 0, y: 70, z: 0 },
      rotation: { x: 0, y: 0 },
      inventory: [
        { type: "grass", count: 64, slot: 0 },
        { type: "dirt", count: 64, slot: 1 },
        { type: "stone", count: 64, slot: 2 },
        { type: "wood", count: 64, slot: 3 },
        { type: "leaves", count: 64, slot: 4 },
      ],
    });

    return worldId;
  },
});

export const getUserWorlds = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("worlds")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const getWorld = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const world = await ctx.db.get(args.worldId);
    if (!world) {
      throw new Error("World not found");
    }

    // Check if user has access
    if (world.ownerId !== userId && !world.isPublic) {
      throw new Error("Access denied");
    }

    return world;
  },
});
