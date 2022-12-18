import { router, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@server/prisma";
import { JoinCode } from "@utils/input_validation";
import { defaultSessionSelect } from "./session";

export const joinRouter = router({
  // GET
  get: procedure
    .input(
      z.object({
        join_code: JoinCode,
      }),
    )
    .query(async ({ input }) => {
      const { join_code } = input;

      const session = await prisma.session.findUnique({
        select: defaultSessionSelect,
        where: { join_code: join_code.toUpperCase() },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No session with join_code '${join_code}'`,
        });
      }

      return session;
    }),
});
