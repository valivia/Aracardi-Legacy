import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";
import { zIdentifier } from "@utils/input_validation";

const defaultAddonSelect = Prisma.validator<Prisma.AddonSelect>()({
  id: true,
  created_at: true,
  updated_at: true,

  title: true,
  description: true,

  has_image: true,
  is_official: true,

  online_size: true,
  online_nsfw_size: true,
  offline_size: true,
  offline_nsfw_size: true,
});

const defaultAddonSorting = z.object({
  created_at: z.enum(["asc", "desc"]).default("desc"),
  // popularity: z.enum(["asc", "desc"]).default("desc"), // TODO: Figure out how to store / sort popularity
});

const addonSorting = defaultAddonSorting
  .extend({
    online_size: z.enum(["asc", "desc"]).default("desc"),
  })
  .default({}) // default is required so we always have an object value
  .or(
    defaultAddonSorting
      .extend({
        offline_size: z.enum(["asc", "desc"]).default("desc"),
      })
      .default({}) // default is required so we always have an object value
  );

export const addonRouter = router({
  all: procedure
    .input(
      z.object({
        game_id: zIdentifier,
        limit: z.number().min(1).max(100).default(50),
        cursor: zIdentifier.nullish(),
        inFavorites: z.boolean().default(false),
        officialOnly: z.boolean().default(false),
        search: z.string().nullish(),
        orderBy: addonSorting,
      })
    )
    .query(async ({ input }) => {
      const { game_id, cursor, inFavorites, officialOnly, orderBy, search } = input;

      // TODO: Retrieve from context once auth is implemented
      const user = await prisma.user.findFirst({
        select: {
          favourite_addons: true,
        },
      });

      const favorites = user?.favourite_addons.map(x => x.id);

      const items = await prisma.addon.findMany({
        select: defaultAddonSelect,
        take: input.limit + 1,
        where: {
          game_id,
          is_draft: false,
          ...(search ? { title: { contains: search, mode: "insensitive" } } : {}), // TODO: Use full-text search (Prisma + MongoDB isn't supported haaa)
          id: inFavorites && favorites?.length ? { in: favorites } : undefined,
          is_official: officialOnly || undefined, // if officialOnly is false, we don't want to filter by is_official
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          "online_size" in orderBy ? { online_size: orderBy.online_size } : undefined as never,
          "offline_size" in orderBy ? { offline_size: orderBy.offline_size } : undefined as never,
          { created_at: orderBy.created_at }, // Important to have this last, so that other sorts go first
        ],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > input.limit) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  get: procedure
    .input(
      z.object({
        id: zIdentifier,
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const addon = await prisma.addon.findUnique({
        where: { id },
        select: defaultAddonSelect,
      });
      if (!addon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No addon with id '${id}'`,
        });
      }
      return addon;
    }),
  add: procedure
    .input(
      z.object({
        title: z.string().min(1).max(32),
        description: z.string().min(1).max(256),
        game_id: zIdentifier,
      })
    )
    .mutation(async ({ input }) => {
      const addon = await prisma.addon.create({
        data: { ...input },
        select: defaultAddonSelect,
      });
      return addon;
    }),
});
