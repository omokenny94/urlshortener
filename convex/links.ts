import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const reservedSlugs = ["api", "admin", "dashboard", "login", "signup", "expired"];

function generateSlug(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let slug = "";

  for (let i = 0; i < length; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }

  return slug;
}

function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-]{3,50}$/.test(slug);
}

function isValidUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export const checkSlugAvailability = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = args.slug.trim();

    if (!isValidSlug(slug)) {
      return {
        available: false,
        message: "Slug must be 3–50 characters and use only letters, numbers, and hyphens.",
      };
    }

    if (reservedSlugs.includes(slug.toLowerCase())) {
      return {
        available: false,
        message: "This slug is reserved.",
      };
    }

    const existing = await ctx.db
      .query("links")
      .withIndex("by_slug", (q) => q.eq("shortSlug", slug))
      .first();

    return {
      available: !existing,
      message: existing ? "Slug already taken." : "Slug is available.",
    };
  },
});

function startOfToday() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today.getTime();
}

export const createShortLink = mutation({
  
  args: {
    originalUrl: v.string(),
    customSlug: v.optional(v.string()),
    userId: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const originalUrl = args.originalUrl.trim();

    if (!isValidUrl(originalUrl)) {
      throw new Error("Please enter a valid http or https URL.");
    }

    const todayStart = startOfToday();

const todaysLinks = await ctx.db
  .query("links")
  .filter((q) =>
    q.gte(q.field("createdAt"), todayStart)
  )
  .collect();

  if (!args.userId && todaysLinks.length >= 5) {
  throw new Error(
    "Anonymous users can only create 5 links per day."
  );
}

    let shortSlug: string | undefined = args.customSlug?.trim();

    if (shortSlug) {
      if (!isValidSlug(shortSlug)) {
        throw new Error("Custom slug must be 3–50 characters and use only letters, numbers, and hyphens.");
      }

      if (reservedSlugs.includes(shortSlug.toLowerCase())) {
        throw new Error("This slug is reserved.");
      }

      const existing = await ctx.db
        .query("links")
        .withIndex("by_slug", (q) => q.eq("shortSlug", shortSlug!))
        .first();

      if (existing) {
        throw new Error("This custom slug is already taken.");
      }
    } else {
      let attempts = 0;

      while (!shortSlug && attempts < 10) {
        const generatedSlug = generateSlug(6);

        const existing = await ctx.db
          .query("links")
          .withIndex("by_slug", (q) => q.eq("shortSlug", generatedSlug))
          .first();

        if (!existing) {
          shortSlug = generatedSlug;
        }

        attempts++;
      }

      if (!shortSlug) {
        throw new Error("Could not generate a unique slug. Please try again.");
      }
    }

    const linkId = await ctx.db.insert("links", {
      userId: args.userId,
      originalUrl,
      shortSlug: shortSlug!,
      clickCount: 0,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
      expired: false,
    });

    return {
      linkId,
      shortSlug,
    };
  },
});

export const getLinkBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("links")
      .withIndex("by_slug", (q) => q.eq("shortSlug", args.slug))
      .first();
  },
});

// export const getUserLinks = query({
//   args: {
//     userId: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     if (!args.userId) return [];

//     return await ctx.db
//       .query("links")
//       .withIndex("by_user", (q) => q.eq("userId", args.userId))
//       .order("desc")
//       .collect();
//   },
// });

export const getUserLinks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("links")
      .order("desc")
      .collect();
  },
});

export const deleteLink = mutation({
  args: {
    linkId: v.id("links"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.linkId);
  },
});

export const trackClick = mutation({
  args: {
    slug: v.string(),
    referrer: v.optional(v.string()),
    device: v.optional(v.string()),
    country: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_slug", (q) =>
        q.eq("shortSlug", args.slug)
      )
      .first();

    if (!link) {
      return;
    }

    await ctx.db.insert("clicks", {
      linkId: link._id,
      timestamp: Date.now(),
      referrer: args.referrer,
      device: args.device,
      country: args.country,
    });

    await ctx.db.patch(link._id, {
      clickCount: link.clickCount + 1,
    });
  },
});

export const getClicksForLink = query({
  args: {
    slug: v.string(),
  },

  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_slug", (q) =>
        q.eq("shortSlug", args.slug)
      )
      .first();

    if (!link) return [];

    return await ctx.db
      .query("clicks")
      .withIndex("by_link", (q) =>
        q.eq("linkId", link._id)
      )
      .collect();
  },
});

export const getAnalytics = query({
  args: {
    slug: v.string(),
  },

  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_slug", (q) =>
        q.eq("shortSlug", args.slug)
      )
      .first();

    if (!link) return null;

    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_link", (q) =>
        q.eq("linkId", link._id)
      )
      .collect();

    return {
      totalClicks: clicks.length,
      clicks,
    };
  },
});

export const bulkDeleteLinks = mutation({
  args: {
    linkIds: v.array(v.id("links")),
  },

  handler: async (ctx, args) => {
    for (const linkId of args.linkIds) {
      await ctx.db.delete(linkId);
    }
  },
});