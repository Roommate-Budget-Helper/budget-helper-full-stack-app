// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

export const appRouter = createRouter()
  .transformer(superjson).query("findAll", {
  resolve: async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
