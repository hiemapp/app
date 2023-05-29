import { userRouter } from './user';
import { languageRouter } from './language';
import { deviceRouter } from './device';
import { flowRouter } from './flow';
import { authRouter } from './auth';
import { flowEditorRouter } from './flowEditor';
import { router } from '../trpc';
import { dashboardRouter } from './dashboard';

export const appRouter = router({
    user: userRouter,
    language: languageRouter,
    device: deviceRouter,
    auth: authRouter,
    flowEditor: flowEditorRouter,
    flow: flowRouter,
    dashboard: dashboardRouter
});

export type AppRouter = typeof appRouter;