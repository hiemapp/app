import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Device, DeviceController, type GetPropsSerializedType } from 'zylax';

export const deviceRouter = router({
    list: publicProcedure
        .query(async ({ ctx }): Promise<GetPropsSerializedType<Device>[]> => {
            return await ctx.getCollection(Device, (d) => {
                return ctx.user.hasPermission(`devices.read.${d.getId()}`);
            });
        }),

    get: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ ctx, input }): Promise<GetPropsSerializedType<Device>> => {  
            ctx.requirePermission(`devices.read.${input.id}`);
            return await ctx.getDocumentOrThrow(Device, input.id);
        }),

    handleInput: publicProcedure
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
            const device = DeviceController.find(input.id);
            await Promise.all(input.values.map(async ({ name, value }) => {
                return await device.handleInput(name, value).catch((err: Error) => {
                    throw new TRPCError({
                        message: err.message,
                        code: 'METHOD_NOT_SUPPORTED'
                    })
                })
            }))
        })
})