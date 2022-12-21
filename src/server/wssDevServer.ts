import { createContext } from "./context";
import { appRouter } from "./routers/_app";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

const port = +(process.env.PORT || 3000);

const wss = new ws.Server({
  port,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (socket) => {
  console.log(`++ Connection (${wss.clients.size})`);
  socket.once("close", () => {
    console.log(`-- Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on ws://localhost:${port}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
