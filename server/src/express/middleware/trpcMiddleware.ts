import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '@/trpc/routers/_app';
import { createContext } from '@/trpc/context';

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext as any
});