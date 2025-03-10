import { router, publicProcedure } from '../trpc';
import { record, z } from 'zod';
import { Device, RecordSampler } from 'hiem';

export const recordRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) =>
            (await ctx.getIndex(Device, [])).filter(d => d.getOption('recording.enabled') === true)
        ),

    listToday: publicProcedure.input(z.object({
        id: z.string(),
        sample: z.number().default(100)
    })).query(async ({ ctx, input }) => {
        const device = await ctx.getResourceOrThrow(Device, input.id);

        const records = await device.records.readToday();

        return {
            records: RecordSampler.serialize(RecordSampler.downsample(records, input.sample))
        }
    }),

    listLatest: publicProcedure.input(z.object({
        id: z.string(),
        top: z.number(),
        sample: z.number().default(100)
    })).query(async ({ ctx, input }) => {
        const device = await ctx.getResourceOrThrow(Device, input.id);

        const records = await device.records.readLatest(input.top);

        return {
            records: RecordSampler.serialize(RecordSampler.downsample(records, input.sample))
        }
    }),

    listPeriod: publicProcedure
        .input(z.object({
            id: z.string(),
            start: z.date(),
            end: z.date(),
            sample: z.number().default(100)
        }))
        .query(async ({ ctx, input }) => {
            const device = await ctx.getResourceOrThrow(Device, input.id);
            
            const records = await device.records.readPeriod(input.start, input.end);

            return {
                records: RecordSampler.serialize(RecordSampler.downsample(records, input.sample))
            }
        })
})