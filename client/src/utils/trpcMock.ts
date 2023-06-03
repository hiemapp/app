interface TRPCMock {
    useQueries: (cb: (...args: any[]) => any) => any[],
    [key: string]: any
}

// @ts-ignore
export const trpc: TRPCMock = {};
export const trpcClient: any = {};