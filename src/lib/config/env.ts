import { z } from "zod";
export const config = z.object({ apiUrl: z.url() }).parse({
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
});
