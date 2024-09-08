import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { ScriptController, Script } from 'hiem';
import { TRPCError } from '@trpc/server';

export const scriptRouter = router({
    code: publicProcedure
        .input(z.object({
            id: z.number(),
            code: z.any()
        }))
        .mutation(async ({ ctx, input }) => {
            const script = ScriptController.find(input.id);
            await script.updateCode(input.code).catch(err => {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: err
                })
            })
        }),

    get: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ ctx, input }) => {  
            ctx.requirePermissionKey(`script.${input.id}.view`);
            return await ctx.getDocumentOrThrow(Script, input.id);
        }),
})