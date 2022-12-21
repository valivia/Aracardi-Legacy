import { observable } from "@trpc/server/observable";
import { procedure, router } from "../trpc";
import { addonRouter } from "./addon";
import { cardRouter } from "./card";
import { gameRouter } from "./game";
import { joinRouter } from "./mockJoin";
import { sessionRouter } from "./session";

export const appRouter = router({
  healthcheck: procedure.query(() => "yay!"),

  game: gameRouter,
  addon: addonRouter,
  card: cardRouter,
  session: sessionRouter,
  mockJoin: joinRouter,
  randomNumber: procedure.subscription(() => {
    return observable<string>((emit) => {
      emit.next("JOINED");
    });
  }),
});

export type AppRouter = typeof appRouter;
