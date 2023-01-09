import { router, procedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";
import { zIdentifier, zJoinCode, zPlayerCreateObject } from "@utils/input_validation";
import { createJoinCode } from "@utils/join_code";
import { isDatabaseError, DatabaseErrorCode } from "@utils/database_error";

export const defaultSessionSelect = Prisma.validator<Prisma.SessionSelect>()({
  id: true,
  created_at: true,
  join_code: true,

  game: {
    select: {
      title: true,
      backlog_percentage: true,
      allow_hotjoin: true,
      has_image: true,
    },
  },

  players: {
    select: {
      id: true,
      name: true,
      avatar_id: true,
      points: true,
    },
  },

});

const getSessionByJoinCode = async (joinCode: string) => {
  const join_code = joinCode.toUpperCase();

  const session = await prisma.session.findUnique({
    select: defaultSessionSelect,
    where: { join_code },
  });

  if (!session) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No session with join_code '${join_code}'`,
    });
  }

  return session;
};

const generateToken = (): string => { //  TODO implement this
  return "";
};


export const sessionRouter = router({
  // GET
  get: procedure
    .input(
      z.object({
        id: zIdentifier,
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
        timer_multiplier: z.number().max(2).min(0),
        turn_multiplier: z.number().max(2).min(0),
        allow_nsfw: z.boolean(),
        game_id: zIdentifier,
      }),
    )
    .mutation(async ({ input }) => {
      const { game_id, timer_multiplier, turn_multiplier, allow_nsfw } = input;

      // Generate x random codes to try.
      const randomCodes = new Array(10).fill(1).map(createJoinCode);

      // Loop over codes and attempt to make session
      for (const join_code of randomCodes) {
        try {
          const session = await prisma.session.create({
            select: defaultSessionSelect,
            data: {
              game: { connect: { id: game_id } },
              join_code,
              timer_multiplier,
              turn_multiplier,
              allow_nsfw,
            },
          });

          return session;
        } catch (error) {
          if (!isDatabaseError(error, DatabaseErrorCode.UniqueViolation)) {
            console.error(error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
            });
          }
        }
      }

      // Throw error if failed.
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "cant generate session code :(",
      });
    }),

  // GET a session by join code
  getByJoinCode: procedure
    .input(
      z.object({
        join_code: zJoinCode,
      }),
    )
    .query(async ({ input }) => {
      const { join_code } = input;
      return await getSessionByJoinCode(join_code);
    }),

  // join a session by join code
  join: procedure
    .input(
      z.object({
        join_code: zJoinCode,
        player: zPlayerCreateObject,
      })
    )
    .mutation(async ({ input }) => {
      const { join_code, player: playerCreate } = input;

      const session = await getSessionByJoinCode(join_code);

      const token = generateToken(); // TODO call this with proper parameters

      const createdPlayer = await prisma.player.create({
        data: {
          token,
          name: playerCreate.name,
          avatar_id: playerCreate.avatar_id,
          session_id: session.id,
        },
      });

      if (!createdPlayer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to create new player for session with id: '${session.id}'`,
        });
      }

      return createdPlayer;
    }),
});
