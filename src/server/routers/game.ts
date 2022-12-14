import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";

const defaultPostSelect = Prisma.validator<Prisma.GameSelect>()({
  id: true,
  title: true,
});

export const gameRouter = router({
  all: procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor } = input;

      const items = await prisma.game.findMany({
        select: defaultPostSelect,
        take: input.limit + 1,
        where: {},
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
        // Remove the last item and use it as next cursor

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
      const game = await prisma.game.findUnique({
        where: { id },
        select: defaultPostSelect,
      });
      if (!game) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No game with id '${id}'`,
        });
      }
      return game;
    }),
  add: procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(32),
        description: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ input }) => {
      const game = await prisma.game.create({
        data: { ...input, default_settings: {} },
        select: defaultPostSelect,
      });
      return game;
    }),
});