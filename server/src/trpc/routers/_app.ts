import { userRouter } from './user';
import { languageRouter } from './language';
import { deviceRouter } from './device';
import { flowRouter } from './flow';
import { authRouter } from './auth';
import { flowEditorRouter } from './flowEditor';
import { router } from '../trpc';
import { recordRouter } from './record';
import { homeRouter } from './home';
import { scriptRouter } from './script';
import { scriptEditorRouter } from './scriptEditor';


export const appRouter = router({
    user: userRouter,
    language: languageRouter,
    device: deviceRouter,
    auth: authRouter,
    flowEditor: flowEditorRouter,
    flow: flowRouter,
    record: recordRouter,
    home: homeRouter,
    script: scriptRouter,
    scriptEditor: scriptEditorRouter
});

export type AppRouter = typeof appRouter;