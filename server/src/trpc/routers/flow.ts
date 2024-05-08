import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { FlowController, Flow } from 'zylax';

export const flowRouter = router({
    edit: publicProcedure
        .input(z.object({
            id: z.number(),
            workspace: z.any()
        }))
        .mutation(async ({ ctx, input }) => {
            const flow = FlowController.find(input.id);
            await flow.update(input.workspace);
        }),


    index: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.getIndex(Flow, ['name', 'icon', 'color'], (d) => {
                return ctx.req.user.hasPermission(`flow.${d.id}.read`);
            });
        })
})