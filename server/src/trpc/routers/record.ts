import { router, publicProcedure } from '../trpc';
import { record, z } from 'zod';
import { Device, RecordSampler } from 'hiem';

export const recordRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) =>
            await ctx.getIndex(Device, [], device => ctx.req.user.hasPermission(device, 'view') && device.getOption('recording.enabled') === true)
        ),

    listLatest: publicProcedure.input(z.object({
        id: z.number(),
        top: z.number()
    })).query(async ({ ctx, input }) => {
        const device = await ctx.getResourceOrThrow(Device, input.id);

        const records = await device.records.readLatest(500);
        const sampler = new RecordSampler(records);
        const datasets = sampler.downsample(10);

        console.log(datasets.length, records.length);

        return {
            datasets: datasets,
            fields: device.records.fields
        }
    }),

    listPeriod: publicProcedure
        .input(z.object({
            id: z.number(),
            start: z.date(),
            end: z.date()
        }))
        .query(async ({ ctx, input }) => {
            const device = await ctx.getResourceOrThrow(Device, input.id);
            // const recordSet = await device.records.readPeriod(input.start, input.end, false);

            return {
                // records: recordSet.getRecords(),
                records: [],
                fields: device.records.fields
            }
        })
})