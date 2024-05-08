import { publicProcedure, router } from '../trpc';
import path from 'path';
import fs from 'fs/promises';
import { Notification, Script } from 'zylax';
import z from 'zod';
import { TRPCError } from '@trpc/server';

export const scriptEditorRouter = router({
    apiTypes: publicProcedure
        .query(async ({ ctx }) => {
            const coreDir = path.dirname(require.resolve('zylax/package.json'));
            const apiTypesFilepath = path.join(coreDir, 'dist/scripts/api/ScriptApi.monaco-types.d.ts');

            const types = await fs.readFile(apiTypesFilepath, 'utf8');

            return { types };
        }),

    update: publicProcedure
        .input(z.object({
            id: z.number(),
            code: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const script = await ctx.getResourceOrThrow(Script, input.id);

            try {
                await script.update(input.code);

                const notification = new Notification({ id: '@zylax/core.lorem.ipsum.dolor' });
                
                notification.addRecipients(ctx.req.user);
                notification.send();
            } catch(err: any) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: err?.message ?? err
                })
            }
        })
})