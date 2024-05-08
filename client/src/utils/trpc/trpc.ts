import { createTRPCReact, createTRPCProxyClient, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../../../server/src/trpc/routers/_app';
import SuperJSON from 'superjson';
import HomeController from '../homes/HomeController';

export const trpc = createTRPCReact<AppRouter>();

const trpcClientConfig = {
    links: [
        httpBatchLink({
            url: '',
            fetch(path, options) {
                const home = HomeController.findCurrent();

                const token = home.userdata?.token!;
                const url = home.baseUrl + '/trpc' + path;

                return fetch(url, {
                    ...options,
                    headers: {
                        ...options?.headers,
                        'x-auth-token': token
                    }
                });
            },
        }),
    ],
    transformer: SuperJSON as any
}

export const trpcProxyClient = createTRPCProxyClient<AppRouter>(trpcClientConfig);
export const trpcClient = trpc.createClient(trpcClientConfig);