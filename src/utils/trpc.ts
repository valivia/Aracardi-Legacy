import { createWSClient, httpBatchLink, loggerLink, wsLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@server/routers/_app";
import superjson from "superjson";
import getConfig from "next/config";
import type { NextPageContext } from "next";
import type { inferProcedureOutput } from "@trpc/server";

const { publicRuntimeConfig } = getConfig();

const { APP_URL, WS_URL } = publicRuntimeConfig;

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${APP_URL}/api/trpc`,
      headers() {
        if (ctx?.req) {
          // on ssr, forward client's headers to the server
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
    });
  }

  const client = createWSClient({
    url: WS_URL,
  });
  return wsLink<AppRouter>({
    client,
  });
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        getEndingLink(ctx),
      ],
    };
  },
  ssr: false,
});

type Procedures = AppRouter["_def"]["procedures"];

/**
 * Determine the output type of a procedure
 * @example
 * type AllGamesOutput = ProcedureOutput<"game", "all">
 */
export type ProcedureOutput<
  TRouteKey extends keyof Procedures,
  TProcedureKey extends keyof Procedures[TRouteKey]
> = inferProcedureOutput<AppRouter["_def"]["procedures"][TRouteKey][TProcedureKey]>;
