import type { Session } from "@prisma/client";
import { createEventEmitter } from "@server/events/createEventEmitter";
import type { Player } from "@structs/player";
import type { WebSocket, WebSocketServer } from "ws";

type SessionPlayer = Pick<Player, "id" | "name">;

type Room = {
  id: string;
  host: SessionPlayer;
  players: SessionPlayer[];
  gameId: string;
};

const sessionActions = {
  START: undefined,
  STOP: undefined,
} as const;

type SessionActions = typeof sessionActions;
type SessionAction = keyof SessionActions;

const rooms = new Map<string, Room>();
const socketClients = new Map<string, WebSocket>();

type SessionEvents = {
  join: (data: { session: Session; player: SessionPlayer }) => void;
  leave: (data: { session: Session; player: SessionPlayer }) => void;
  action: <A extends SessionAction>(data: {
    session: Session;
    player: SessionPlayer;
    type: A;
    payload: SessionActions[A];
  }) => void;
};

export const sessionEmitter = createEventEmitter<SessionEvents>();

export const handleSessionConnections = (ws: WebSocketServer): void => {
  ws.on("connection", (socket, request) => {
    const cookies = Object.fromEntries(
      request.headers.cookie?.split(";").map((c) => [c.split("=")[0].trim(), c.split("=")[1].trim()]) ?? []
    );

    // Track each socket connection by session ID
    const { sessionId } = cookies;
    if (sessionId) {
      socketClients.set(sessionId, socket);
    }

    console.log(`++ Connection (${ws.clients.size})`);

    socket.once("close", () => {
      console.log(`-- Connection (${ws.clients.size})`);
    });
  });
};

sessionEmitter.on("join", ({ session, player }) => {
  console.log("join", { player, session });
  if (!rooms.has(session.join_code)) {
    rooms.set(session.join_code, {
      id: session.join_code,
      host: player,
      players: [],
      gameId: session.game_id,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const room = rooms.get(session.join_code)!;

  room.players.push(player);

  room.players
    .filter((p) => p.id !== player.id)
    .forEach((p) => {
      const client = socketClients.get(p.id);

      client?.send(
        JSON.stringify({
          type: "player-join",
          payload: {
            playerId: player.id,
            session: room,
          },
        })
      );
    });
});

sessionEmitter.on("leave", ({ session, player }) => {
  console.log("leave", { player, session });
  if (!rooms.has(session.join_code)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const room = rooms.get(session.join_code)!;

  room.players = room.players.filter((p) => p.id !== player.id);

  // Remove the room if it's empty
  if (!room.players.length) {
    rooms.delete(session.join_code);
  }
});

sessionEmitter.on("action", ({ type, session, payload }) => {
  const room = rooms.get(session.join_code);
  if (!room) {
    console.log("action", { type, payload }, "room doesn't exist");
    return;
  }

  console.log("action", { type, payload });
  if (type === "START") {
    room.players.forEach((player) => {
      const client = socketClients.get(player.id);
      client?.send(JSON.stringify({ type: "START_GAME", payload: room.gameId }));
    });
    return;
  }

  if (type === "STOP") {
    room.players.forEach((player) => {
      const client = socketClients.get(player.id);
      client?.terminate();
    });
    return;
  }
});
