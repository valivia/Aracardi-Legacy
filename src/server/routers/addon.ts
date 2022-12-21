import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";
import { DbId } from "@utils/input_validation";

const defaultAddonSelect = Prisma.validator<Prisma.AddonSelect>()({
  id: true,
  created_at: true,
  updated_at: true,

  title: true,
  description: true,

  has_image: true,
  is_official: true,
  is_available_online: true,
  is_available_offline: true,
});

export const addonRouter = router({
  all: procedure
    .input(
      z.object({
        game_id: DbId,
        limit: z.number().min(1).max(100).default(50),
        cursor: DbId.nullish(),
      })
    )
    .query(async ({ input }) => {
      const { cursor } = input;

      const items = await prisma.addon.findMany({
        select: defaultAddonSelect,
        take: input.limit + 1,
        where: { game_id: input.game_id/* , NOT: { is_draft: true }*/ }, // TODO
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { created_at: "desc" },
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
        id: DbId,
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
        game_id: DbId,
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
