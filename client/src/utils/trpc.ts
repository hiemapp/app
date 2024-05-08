import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../../server/src/trpc/routers/_app';
import SuperJSON from 'superjson';
 
export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: '/trpc'
        }),
    ],
    transformer: SuperJSON
});