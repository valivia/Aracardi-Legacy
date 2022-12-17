import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";
import { DbId } from "@utils/input_validation";

const defaultCardSelect = Prisma.validator<Prisma.CardSelect>()({
  id: true,
  created_at: true,
  updated_at: true,

  minimum_players: true,
  maximum_players: true,
  is_nsfw: true,

  addon_id: true,
  stages: true,
});

export const cardRouter = router({
  all: procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: DbId.nullish(),
        addon_id: DbId,
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
        id: DbId,
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
        addon_id: DbId,
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
