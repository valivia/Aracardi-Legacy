import { z } from "zod";

export const DbId = z.string().length(24);

export const JoinCode = z.string().length(4);
