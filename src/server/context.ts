import type trpc from "@trpc/server";
import type trpcNext from "@trpc/server/adapters/next";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import type { IncomingMessage } from "http";
import type ws from "ws";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  _opts: trpcNext.CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  // TODO: Replace with auth sessions
  const cookies = Object.fromEntries(
    _opts.req.headers.cookie?.split(";").map((c) => [c.split("=")[0].trim(), c.split("=")[1].trim()]) ?? []
  );

  return {
    session: cookies.sessionId ?? null,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
