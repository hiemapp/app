import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { ScriptController, Script } from 'hiem';

export const scriptRouter = router({
    code: publicProcedure
        .input(z.object({
            id: z.number(),
            code: z.any()
        }))
        .mutation(async ({ ctx, input }) => {
            const script = ScriptController.find(input.id);
            await script.updateCode(input.code, ctx.req.user)
        }),

    index: publicProcedure
        .query(async ({ ctx }) => ctx.getIndex(Script, ['name', 'icon'])),

    get: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(({ ctx, input }) => ctx.getDocumentOrThrow(Script, input.id)),
})