import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";

const defaultSessionSelect = Prisma.validator<Prisma.SessionSelect>()({
  id: true,
  created_at: true,

  settings: true,
  game: { select: { title: true } },

  players: {
    select: {
      id: true,
      name: true,
      avatar: true,
      points: true,
    },
  },

});

export const sessionRouter = router({
  // GET
  get: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const addon = await prisma.session.findUnique({
        where: { id },
        select: defaultSessionSelect,
      });
      if (!addon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No session with id '${id}'`,
        });
      }
      return addon;
    }),
  // ADD
  add: procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        addon_ids: z.string().length(24).array(),
        game_id: z.string().length(24),
      }),
    )
    .mutation(async ({ input }) => {
      const addon = await prisma.session.create({
        data: { ...input, settings: {}, join_code: "" },
        select: defaultSessionSelect,
      });
      return addon;
    }),

});
