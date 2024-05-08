import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Device, DeviceController, Notification } from 'zylax';
import type { GetPropsSerializedType } from 'zylax/@types/helpers';

export const recordingRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) =>
            await ctx.getIndex(Device, [], device => ctx.req.user.hasPermission(device, 'view') && device.getOption('recording.enabled') === true)
        ),

    getPeriod: publicProcedure
        .input(z.object({
            id: z.number(),
            start: z.date(),
            end: z.date()
        }))
        .query(async ({ ctx, input }) => {
            const device = await ctx.getResourceOrThrow(Device, input.id);
            const records = await device.records.readPeriod(input.start, input.end, false);
            return {
                id: device.id,
                records: records.map(r => r.toJSON()),
                fieldNames: device.records.fieldNames
            }
        })
})