import { z } from "zod";

export const DbId = z.string().length(24);

export const JOIN_CODE = z.string().length(4);

export const PLAYER_CREATE_OBJECT = z.object({
  name: z.string(),
  avatar: z.string(),
});
