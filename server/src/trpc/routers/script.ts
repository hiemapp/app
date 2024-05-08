import { publicProcedure, router } from '../trpc';
import { Script } from 'zylax';
import z from 'zod';

export const scriptRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.getIndex(Script, ['name', 'icon'], (d) => {
                return ctx.req.user.hasPermission(`script.${d.id}.read`);
            });
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