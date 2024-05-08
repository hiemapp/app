import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { FlowController, Flow } from 'hiem';

export const flowRouter = router({
    edit: publicProcedure
        .input(z.object({
            id: z.number(),
            state: z.any()
        }))
        .mutation(async ({ ctx, input }) => {
            const flow = FlowController.find(input.id);
            await flow.update(input.state);
        }),


    index: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.getIndex(Flow, ['name', 'icon', 'color'], (d) => {
                return ctx.req.user.hasPermission(`flow.${d.id}.read`);
            });
        }),

    get: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ ctx, input }) => {  
            ctx.requirePermissionKey(`flow.${input.id}.view`);
            return await ctx.getDocumentOrThrow(Flow, input.id);
        }),
})