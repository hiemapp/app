import { router, publicProcedure } from '../trpc';
import { ExtensionController, DashboardWidget } from 'zylax';
import _ from 'lodash';
import { z } from 'zod';
import { serializeWidgetNode } from 'zylax';

export const dashboardRouter = router({
    getRenderedWidget: publicProcedure
        .input(z.object({
            slug: z.string() 
        }))
        .query(({ ctx, input }) => {
            const widget = ExtensionController.findModule(DashboardWidget, input.slug);

            return {
                manifest: widget.prototype.getManifest(),
                content: serializeWidgetNode(widget.prototype.render())
            };
        })
})