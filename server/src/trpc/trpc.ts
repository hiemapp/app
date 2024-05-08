import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import { Context } from './context';
import errorFormatter from '@/trpc/errorFormatter';

const t = initTRPC.context<Context>().create({
    transformer: SuperJSON,
    errorFormatter: errorFormatter
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;