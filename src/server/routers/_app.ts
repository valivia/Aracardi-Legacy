import { observable } from "@trpc/server/observable";
import { procedure, router } from "../trpc";
import { addonRouter } from "./addon";
import { cardRouter } from "./card";
import { gameRouter } from "./game";
import { sessionRouter } from "./session";

export const appRouter = router({
  healthcheck: procedure.query(() => "yay!"),

  game: gameRouter,
  addon: addonRouter,
  card: cardRouter,
  session: sessionRouter,
  randomNumber: procedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);

      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
