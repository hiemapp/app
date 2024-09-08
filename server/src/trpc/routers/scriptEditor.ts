import { ScriptLibManager } from 'hiem';
import { router, publicProcedure } from '../trpc';
import path from 'path';

export const scriptEditorRouter = router({
    libs: publicProcedure
        .query(async ({ ctx }) => {  
            return ScriptLibManager.getLibs();
        }),
})