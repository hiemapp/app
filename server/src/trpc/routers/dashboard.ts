import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import _ from 'lodash';
import { z } from 'zod';
import { DashboardWidgetManager, ExtensionController, renderWidgetAndSerialize } from 'zylax';
import { DashboardWidget } from 'zylax';

const widgetSessions: Record<string, DashboardWidget> = {};

export const dashboardRouter = router({
    getRenderedWidget: publicProcedure
        .input(z.object({
            slug: z.string()
        }))
        .query(({ ctx, input }) => {
            const sessionId = `${input.slug.trim()}#user${ctx.user.getId()}`;
            const widget = DashboardWidgetManager.getOrCreateWidget(input.slug, sessionId);

            if(!widget) {
                throw new TRPCError({
                    message: 'Invalid widget session.',
                    code: 'NOT_FOUND'
                })
            }

            return {
                sessionId: sessionId,
                manifest: widget.getManifest(),
                content: widget.render()
            };
        }),

    handleNodeEvent: publicProcedure
        .input(z.object({
            sessionId: z.string(),
            listenerId: z.string()
        }))
        .mutation(({ ctx, input }) => {
            // Find the widget by the session id
            const widget = DashboardWidgetManager.getWidget(input.sessionId);
            if(!widget) {
                throw new TRPCError({
                    message: 'Invalid widget session.',
                    code: 'NOT_FOUND'
                })
            }

            const listener = widget.getListener(input.listenerId);
            if(!listener) {
                throw new TRPCError({
                    message: 'Invalid listener id.',
                    code: 'NOT_FOUND'
                })
            }

            listener.callback();
        })
})