// This file replaces the ./trpc.ts file when building, because of type issues.

interface TRPCMock {
    useQueries: (cb: (...args: any[]) => any) => any[],
    [key: string]: any
}

// @ts-ignore
export const trpc: TRPCMock = {};
export const trpcClient: any = {};
export const trpcProxyClient: any = {};