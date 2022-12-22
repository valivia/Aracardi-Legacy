import { router, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";
import { JOIN_CODE, PLAYER_CREATE_OBJECT } from "@utils/input_validation";
import { defaultSessionSelect } from "./session";

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

export const joinRouter = router({
  // GET a session by join code
  get: procedure
    .input(
      z.object({
        join_code: JOIN_CODE,
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
        join_code: JOIN_CODE,
        player: PLAYER_CREATE_OBJECT,
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
          avatar: playerCreate.avatar,
          session_id: session.id,
        },
      });

      if (!createdPlayer) {
        // TODO throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to create new player for session with id: '${session.id}'`,
        });
      }

      return createdPlayer;
    }),
});
