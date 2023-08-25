import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Language } from 'zylax';
import type { GetPropsSerializedType } from 'zylax/@types/helpers'

export const languageRouter = router({
    get: publicProcedure
        .input(z.object({
            key: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<GetPropsSerializedType<Language>> => {    
            return await ctx.getDocumentOrThrow(Language, input.key);
        }),
})