import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { FlowController, Flow } from 'hiem';

export const flowRouter = router({
    save: publicProcedure
        .input(z.object({
            id: z.string(),
            state: z.any()
        }))
        .mutation(async ({ ctx, input }) => {
            const flow = FlowController.find(input.id);
            await flow.update(input.state);
        }),


    index: publicProcedure
        .query(({ ctx }) => ctx.getIndex(Flow, ['name', 'icon', 'color'])),

    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(({ ctx, input }) => ctx.getDocumentOrThrow(Flow, input.id)),
})