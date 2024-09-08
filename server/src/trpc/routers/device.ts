import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Device, DeviceController, Notification } from 'hiem';
import type { GetPropsSerializedType } from 'hiem/@types/helpers';

export const deviceRouter = router({
    list: publicProcedure
        .query(async ({ ctx }): Promise<GetPropsSerializedType<Device>[]> =>
            await ctx.getCollection(Device, device => ctx.req.user.hasPermission(device, 'view'))
        ),

    index: publicProcedure
        .query(async ({ ctx }) =>
            await ctx.getIndex(Device, [], device => ctx.req.user.hasPermission(device, 'view'))
        ),

    get: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ ctx, input }) => {  
            ctx.requirePermissionKey(`device.${input.id}.view`);
            return await ctx.getDocumentOrThrow(Device, input.id);
        }),

    execute: publicProcedure
        .input(z.object({
            id: z.number(),
            commands: z.array(
                z.object({
                    name: z.string(),
                    params: z.any()
                })
            )
        }))
        .mutation(async ({ ctx, input }) => {
            ctx.requirePermissionKey(`device.${input.id}.input`);

            const device = await ctx.getResourceOrThrow(Device, input.id);

            const promises = input.commands.map(command => {
                return device.execute(command.name, command.params, ctx.req.user)
            })
            
            await Promise.all(promises);
        })
})