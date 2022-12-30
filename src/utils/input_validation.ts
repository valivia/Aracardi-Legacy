import { z } from "zod";

export const DbId = z.string().length(24);
