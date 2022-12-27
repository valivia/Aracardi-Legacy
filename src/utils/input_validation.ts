import { z } from "zod";

export const DbId = z.string().length(24);

export const zJOIN_CODE = z.string().length(4);

export const zPLAYER_CREATE_OBJECT = z.object({
  name: z.string(),
  avatar: z.string(),
});
