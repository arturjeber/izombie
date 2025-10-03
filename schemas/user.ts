// schemas/user.ts
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
});
