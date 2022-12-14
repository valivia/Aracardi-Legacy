import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";

const defaultCardSelect = Prisma.validator<Prisma.CardSelect>()({
  id: true,
  stages: true,
  is_nsfw: true,
});

export const cardRouter = router({
  all: procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
        addon_id: z.string().length(24),
      }),
    )
    .query(async ({ input }) => {
      const { cursor } = input;

      const items = await prisma.card.findMany({
        select: defaultCardSelect,
        take: input.limit + 1,
        where: { addon_id: input.addon_id },
        cursor: cursor
          ? {
            id: cursor,
          }
          : undefined,
        orderBy: {
          created_at: "desc",
        },
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
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const card = await prisma.card.findUnique({
        where: { id },
        select: defaultCardSelect,
      });
      if (!card) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No card with id '${id}'`,
        });
      }
      return card;
    }),
  add: procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        addon_id: z.string().length(24),
      }),
    )
    .mutation(async ({ input }) => {
      const addon = await prisma.card.create({
        data: { ...input },
        select: defaultCardSelect,
      });
      return addon;
    }),
});
