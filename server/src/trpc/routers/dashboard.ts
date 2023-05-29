import { router, publicProcedure } from '../trpc';
import _ from 'lodash';
import { z } from 'zod';
import { ExtensionController, renderWidgetAndSerialize } from 'zylax';
import { utils, DashboardWidget } from 'zylax';

const widgetSessions: Record<string, DashboardWidget> = {};

export const dashboardRouter = router({
    getRenderedWidget: publicProcedure
        .input(z.object({
            slug: z.string()
        }))
        .query(({ ctx, input }) => {
            const widgetSessionId = `${input.slug}#user${ctx.user.getId()}`;
            const widgetType = ExtensionController.findModule(DashboardWidget, input.slug);
            
            // Find the widget by the session id
            let widget = widgetSessions[widgetSessionId];

            // If no widget exists for this session, create it
            if(!widget) {
                // Construct the widget
                widget = new widgetType(widgetSessionId);

                // Store the widget by the session id
                widgetSessions[widgetSessionId] = widget;

                // Call the mount listener
                widget.onMount();
            }


            return {
                sessionId: widgetSessionId,
                manifest: widget.getManifest(),
                content: renderWidgetAndSerialize(widget)
            };
        })
})