import { router, publicProcedure } from '../trpc';
import { User } from 'zylax';
import { GetPropsSerializedType } from 'zylax/@types/helpers';
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
                ctx.requirePermissionKey(`user.${input.id}.read`);
                userId = input.id;
            }
            
            return await ctx.getDocumentOrThrow(User, userId);
        })
})