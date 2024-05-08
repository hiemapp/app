import { router, publicProcedure } from '../trpc';
import { record, z } from 'zod';
import { Device, RecordSet } from 'hiem';

export const recordRouter = router({
    index: publicProcedure
        .query(async ({ ctx }) =>
            await ctx.getIndex(Device, [], device => ctx.req.user.hasPermission(device, 'view') && device.getOption('recording.enabled') === true)
        ),

    listLatest: publicProcedure.input(z.object({
        id: z.number(),
        top: z.number(),
        skip: z.number()
    })).query(async ({ ctx, input }) => {
        const device = await ctx.getResourceOrThrow(Device, input.id);
        const recordSet = await device.records.readLatest(input.top, input.skip, false);
        // console.log(recordSet.getRecords().length);

        let records = recordSet.getRecords();
        const keepInterval = Math.round(records.length / 500);
        if(keepInterval > 1) {
            records = records.filter((r, i) => i % keepInterval === 0);
        }

        const dataSets = new RecordSet(records).getDataSets();

        return {
            dataSets: dataSets,
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