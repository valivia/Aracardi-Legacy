import { procedure, router } from "../trpc";
import { addonRouter } from "./addon";
import { cardRouter } from "./card";
import { gameRouter } from "./game";
import { joinRouter } from "./join";
import { sessionRouter } from "./session";

export const appRouter = router({
  healthcheck: procedure.query(() => "yay!"),

  game: gameRouter,
  addon: addonRouter,
  card: cardRouter,
  session: sessionRouter,
  join: joinRouter,
});

export type AppRouter = typeof appRouter;
