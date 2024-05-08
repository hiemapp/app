import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Device, DeviceController, Notification } from 'zylax';
import type { GetPropsSerializedType } from 'zylax/@types/helpers';

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

    performInput: publicProcedure
        .input(z.object({
        id: z.number(),
            values: z.array(
                z.object({
                    name: z.string(),
                    value: z.any()
                })
            )
        }))
        .mutation(async ({ ctx, input }) => {
            ctx.requirePermissionKey(`device.${input.id}.input`);

            const device = DeviceController.find(input.id);
            await Promise.all(input.values.map(async ({ name, value }) => {
                return await device.performInput(name, value, { user: ctx.req.user }).catch(err => {
                    device.logger.error(err);

                    new Notification({ id: '@zylax/core.devices.errors.input.generic', ctx: { device } }, 'error')
                        .addRecipients(ctx.req.socket)
                        .send();

                    throw new TRPCError({
                        message: err,
                        code: 'INTERNAL_SERVER_ERROR'
                    })
                })
            }))
        })
})