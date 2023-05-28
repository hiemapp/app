import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import passport from 'passport';
import { UserController } from 'zylax';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
    login: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            // This let's Passport.js access the username and password that were sent.
            ctx.req.body = input;

            await new Promise<void>((resolve, reject) => {
                passport.authenticate('local', {
                    failWithError: true
                })(ctx.req, ctx.res, (err: any) => {
                    if(err) return reject(err);
                    resolve();
                })
            }).catch(err => {
                if(err?.name === 'AuthenticationError') {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Incorrect username or password.'
                    })
                }

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: err
                })
            })

            const user = UserController.findBy('username', input.username);
            
            return {
                user: await user.serialize()
            }
        }),
})