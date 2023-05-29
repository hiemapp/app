import { router, publicProcedure } from '../trpc';
import { GetPropsSerializedType, User } from 'zylax';
import { z } from 'zod';

export const userRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.union([ z.number(), z.literal('me') ])
        }))
        .query(async ({ ctx, input }): Promise<GetPropsSerializedType<User>> => {
            let userId: number;
            
            if(input.id === 'me') {
                userId = ctx.user.getId();
            } else {
                ctx.requirePermission(`users.read.${input.id}`);
                userId = input.id;
            }
            
            return await ctx.getDocumentOrThrow(User, userId);
        })
})