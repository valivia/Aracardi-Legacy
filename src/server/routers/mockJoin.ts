import { procedure } from "@server/trpc";
import { router } from "../trpc";
import { z } from "zod";
import { sessionEmitter } from "@server/features/socket/connections";

export const joinRouter = router({
  get: procedure
    .input(
      z.object({
        join_code: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { join_code } = input;

      sessionEmitter.emit("join", { session: { join_code } as any, player: { id: ctx.session } as any });

      // const session = await prisma.session.findUnique({
      //   select: {
      //     ...defaultSessionSelect,
      //     game_id: true,
      //   },
      //   where: { join_code: join_code.toUpperCase() },
      // });

      // if (!session) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: `No session with join_code '${join_code}'`,
      //   });
      // }

      // TODO: Join session in database, only then emit the session join event
      // sessionEmitter.emit("join", session);

      // return session;
    }),
});
