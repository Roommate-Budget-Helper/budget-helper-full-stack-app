// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { registerRouter } from "./register";
import { homesRouter } from "./homes";
import { occupiesRouter } from "./occupies";
import { fileUploadRouter } from "./image-upload";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("home.", homesRouter)
    .merge("occupies.", occupiesRouter)
    .merge("auth.", registerRouter)
    .merge("upload.", fileUploadRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
