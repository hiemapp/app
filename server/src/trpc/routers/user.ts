import { router, publicProcedure } from '../trpc';
import { User, UserController } from 'zylax';
import { GetPropsSerializedType } from 'zylax/@types/helpers';
import { z } from 'zod';

export const userRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.union([ z.number(), z.literal('me') ])
        }))
        .query(async ({ ctx, input }) => {
            let userId: number;
            
            if(input.id === 'me') {
                userId = ctx.req.user.id;
            } else {
                ctx.requirePermissionKey(`user.${input.id}.read`);
                userId = input.id;
            }
            
            return ctx.getDocumentOrThrow(User, userId);
        })
})