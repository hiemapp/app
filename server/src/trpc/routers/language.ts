import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Language } from 'hiem';
import type { GetPropsSerializedType } from 'hiem/@types/helpers'

export const languageRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<GetPropsSerializedType<Language>> => {    
            return await ctx.getDocumentOrThrow(Language, input.id);
        }),
})