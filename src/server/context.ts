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
  return {};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
