import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { InferSchema, Language } from 'hiem';

export const languageRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<InferSchema<Language>> => {    
            return await ctx.getDocumentOrThrow(Language, input.id, false);
        }),
})