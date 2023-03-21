// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { registerRouter } from "./register";
import { homesRouter } from "./homes";
import { occupiesRouter } from "./occupies";
import { fileUploadRouter } from "./image-upload";
import { invitationRouter } from "./invitation";
import { billingRouter} from "./billing";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("home.", homesRouter)
    .merge("occupies.", occupiesRouter)
    .merge("auth.", registerRouter)
    .merge("upload.", fileUploadRouter)
    .merge("invite.", invitationRouter)
    .merge("bill.", billingRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
