import { Config } from 'hiem';
import { router, publicProcedure } from '../trpc';

export const homeRouter = router({
    get: publicProcedure
        .query(() => {    
            return Config.get('home');
        })
})