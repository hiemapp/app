import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { authenticate, generateToken } from '@/auth';

export const authRouter = router({
    login: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const username = input.username.trim();
            const password = input.password.trim();

            const user = await authenticate(username, password);
            const token = generateToken(user);

            return {
                userId: user.id,
                auth: {
                    token: token
                }
            }
        })
})