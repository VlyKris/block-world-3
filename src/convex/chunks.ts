import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getChunk = query({
  args: {
    worldId: v.id("worlds"),
    chunkX: v.number(),
    chunkZ: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const chunk = await ctx.db
      .query("chunks")
      .withIndex("by_world_and_position", (q) =>
        q.eq("worldId", args.worldId).eq("chunkX", args.chunkX).eq("chunkZ", args.chunkZ)
      )
      .unique();

    return chunk;
  },
});

export const saveChunk = mutation({
  args: {
    worldId: v.id("worlds"),
    chunkX: v.number(),
    chunkZ: v.number(),
    blocks: v.array(v.object({
      x: v.number(),
      y: v.number(),
      z: v.number(),
      type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if chunk exists
    const existingChunk = await ctx.db
      .query("chunks")
      .withIndex("by_world_and_position", (q) =>
        q.eq("worldId", args.worldId).eq("chunkX", args.chunkX).eq("chunkZ", args.chunkZ)
      )
      .unique();

    if (existingChunk) {
      await ctx.db.patch(existingChunk._id, {
        blocks: args.blocks,
      });
    } else {
      await ctx.db.insert("chunks", {
        worldId: args.worldId,
        chunkX: args.chunkX,
        chunkZ: args.chunkZ,
        blocks: args.blocks,
      });
    }
  },
});

export const updateBlock = mutation({
  args: {
    worldId: v.id("worlds"),
    x: v.number(),
    y: v.number(),
    z: v.number(),
    blockType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const chunkX = Math.floor(args.x / 16);
    const chunkZ = Math.floor(args.z / 16);

    const chunk = await ctx.db
      .query("chunks")
      .withIndex("by_world_and_position", (q) =>
        q.eq("worldId", args.worldId).eq("chunkX", chunkX).eq("chunkZ", chunkZ)
      )
      .unique();

    if (!chunk) {
      // Create new chunk if it doesn't exist
      const blocks = args.blockType ? [{
        x: args.x,
        y: args.y,
        z: args.z,
        type: args.blockType,
      }] : [];

      await ctx.db.insert("chunks", {
        worldId: args.worldId,
        chunkX,
        chunkZ,
        blocks,
      });
    } else {
      // Update existing chunk
      const blocks = chunk.blocks.filter(
        block => !(block.x === args.x && block.y === args.y && block.z === args.z)
      );

      if (args.blockType) {
        blocks.push({
          x: args.x,
          y: args.y,
          z: args.z,
          type: args.blockType,
        });
      }

      await ctx.db.patch(chunk._id, { blocks });
    }
  },
});
