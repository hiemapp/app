import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Device} from 'hiem';

export const deviceRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) => await ctx.getIndex(Device, [])),

    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(({ ctx, input }) => ctx.getDocumentOrThrow(Device, input.id)),

    getDriverManifest: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }) => {  
            const device = await ctx.getResourceOrThrow(Device, input.id);
            return device.driver.getManifest(device).toJSON();
        }),
    
    execute: publicProcedure
        .input(z.object({
            id: z.string(),
            commands: z.array(
                z.object({
                    name: z.string(),
                    params: z.any()
                })
            )
        }))
        .mutation(async ({ ctx, input }) => {
            const device = await ctx.getResourceOrThrow(Device, input.id, 'interact');

            const promises = input.commands.map(command => {
                return device.execute(command.name, command.params, ctx.req.user)
            })
            
            await Promise.all(promises);
        })
})