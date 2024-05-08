import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Notification, UserController } from 'zylax';
import { TRPCError } from '@trpc/server';
import { authenticate, generateToken, AUTH_COOKIE_NAME } from '@/auth';

export const authRouter = router({
    login: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const username = input.username.trim();
            const password = input.password.trim();

            let response = null;

            await authenticate(username, password)
            .then(user => {
                const token = generateToken(user);

                ctx.res.cookie(AUTH_COOKIE_NAME, token, { 
                    maxAge: 365*24*60*60*1000,
                    httpOnly: true
                });

                response = {
                    userId: user.id
                }
            })
            .catch(err => {
                const user = UserController.findBy('username', username);

                const errType = typeof err === 'string' ? err : 'generic';   
                new Notification({ id: `login.errors.auth.${errType}`, ctx: { user }}, 'error')
                    .addRecipients(ctx.req.socket)
                    .send();

                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: `Authentication failed.`,
                    cause: err
                })
            })

            return response;
        })
})