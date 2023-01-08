import { z } from "zod";

export const zIdentifier = z.string().length(36);

export const zJoinCode = z.string().length(4);

export const zPlayerCreateObject = z.object({
  name: z.string(),
  avatar_id: z.string(),
});
