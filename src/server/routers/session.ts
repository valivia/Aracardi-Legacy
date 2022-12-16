import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";

const defaultSessionSelect = Prisma.validator<Prisma.SessionSelect>()({
  id: true,
  created_at: true,

  settings: true,
  join_code: true,

  game: {
    select: {
      title: true,
      default_settings: true,
      has_image: true,
    },
  },

  players: {
    select: {
      id: true,
      name: true,
      avatar: true,
      points: true,
    },
  },

});

const settingsObject = z.object({
  use_images: z.boolean(),
  use_nsfw: z.boolean(),

  timer_multiplier: z.number().gte(0).lte(2),
  turn_multiplier: z.number().gte(0).lte(2),
  backlog_percentage: z.number().gte(0).lte(1),
});

export const sessionRouter = router({
  // GET
  get: procedure
    .input(
      z.object({
        id: z.string().length(24),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;

      const session = await prisma.session.findUnique({
        select: defaultSessionSelect,
        where: { id },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No session with id '${id}'`,
        });
      }

      return session;
    }),

  // ADD
  add: procedure
    .input(
      z.object({
        settings: settingsObject,
        addon_ids: z.string().length(24).array(),
        game_id: z.string().length(24),
      }),
    )
    .mutation(async ({ input }) => {
      const { addon_ids, game_id, settings } = input;

      // Generate x random codes to try.
      const randomCode = () => ((Math.random() + 1).toString(36).substring(2, 6).toUpperCase());
      const randomCodes = new Array(10).fill(1).map(() => randomCode());
      let hasDbError = false;

      // Loop over codes and attempt to make session
      for (const join_code of randomCodes) {
        try {
          const session = await prisma.session.create({
            select: defaultSessionSelect,
            data: {
              game: { connect: { id: game_id } },
              join_code,
              addon_ids,
              settings,
            },
          });

          return session;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
          console.error(error);
          hasDbError = true;
          break;
        }
      }

      // Throw error if failed.
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: hasDbError ? undefined : "cant generate session code :(",
      });
    }),

});
