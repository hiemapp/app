import { router, publicProcedure } from '../trpc';
import { User, UserController } from 'hiem';
import { GetPropsSerializedType } from 'hiem/@types/helpers';
import { z } from 'zod';

export const userRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.union([ z.number(), z.literal('me') ])
        }))
        .query(({ ctx, input }) => {           
            if(input.id === 'me') {
                return ctx.getDocumentOrThrow(User, ctx.req.user.id, false);
            }
                
            return ctx.getDocumentOrThrow(User, input.id);
        })
})