import { router, publicProcedure } from '../trpc';
import { record, z } from 'zod';
import { Device, RecordSampler } from 'hiem';

export const recordRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) =>
            (await ctx.getIndex(Device, [])).filter(d => d.getOption('recording.enabled') === true)
        ),

    listToday: publicProcedure.input(z.object({
        id: z.number()
    })).query(async ({ ctx, input }) => {
        const device = await ctx.getResourceOrThrow(Device, input.id);

        const records = await device.records.readToday();
        const sampler = new RecordSampler(records);

        return {
            records: RecordSampler.serialize(sampler.getDatasets())
        }
    }),

    listLatest: publicProcedure.input(z.object({
        id: z.number(),
        top: z.number()
    })).query(async ({ ctx, input }) => {
        const device = await ctx.getResourceOrThrow(Device, input.id);

        const records = await device.records.readLatest(input.top);
        const sampler = new RecordSampler(records);

        return {
            records: RecordSampler.serialize(sampler.getDatasets()),
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