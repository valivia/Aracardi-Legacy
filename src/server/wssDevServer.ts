import { createContext } from "./context";
import { appRouter } from "./routers/_app";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { handleSessionConnections } from "./features/socket/connections";

const port = +(process.env.PORT || 3000);

const wss = new ws.Server({
  port,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext });

handleSessionConnections(wss);

console.log(`✅ WebSocket Server listening on ws://localhost:${port}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
