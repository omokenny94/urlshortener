import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  links: defineTable({
    userId: v.optional(v.string()),

    originalUrl: v.string(),
    shortSlug: v.string(),

    clickCount: v.number(),

    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    expired: v.boolean(),

    qrForeground: v.optional(v.string()),
    qrBackground: v.optional(v.string()),
  })
    .index("by_slug", ["shortSlug"])
    .index("by_user", ["userId"])
    .index("by_createdAt", ["createdAt"]),

  clicks: defineTable({
    linkId: v.id("links"),
    timestamp: v.number(),

    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
  })
    .index("by_link", ["linkId"])
    .index("by_timestamp", ["timestamp"]),
});