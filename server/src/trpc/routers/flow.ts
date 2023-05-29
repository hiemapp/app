import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { FlowController } from 'zylax';

export const flowRouter = router({
    edit: publicProcedure
        .input(z.object({
            id: z.number(),
            workspace: z.any()
        }))
        .mutation(async ({ ctx, input }) => {
            const flow = FlowController.find(input.id);
            console.log({ a: input.workspace })

            flow.updateWorkspace(input.workspace);
        })
})