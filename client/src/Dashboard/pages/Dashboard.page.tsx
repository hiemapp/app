import { Page, Container } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import DashboardWidget from '../components/DashboardWidget';
import type { SerializedNode } from 'zylax';
import { trpc } from '@/utils/trpc';
import app from '@/utils/app';

function handleWidgetNodeEvent(e: React.SyntheticEvent, node: SerializedNode) {
    console.log({ e, node });
}

const Dashboard: React.FunctionComponent = () => {
    const widgetSlugs: string[] = app().currentUser.getSetting('dashboardWidgets') ?? [];

    const widgets = trpc.useQueries(t =>
        widgetSlugs.map(slug => t.dashboard.getRenderedWidget({ slug }))
    );

    function renderWidgets() {
        if(widgets.some(w => w.isLoading)) return null;

        return widgets.map(w => {
            if(!w.data?.content || !w.data?.manifest) return null;

            return (
                <DashboardWidget 
                    manifest={w.data.manifest}
                    content={w.data.content}
                    handleWidgetNodeEvent={handleWidgetNodeEvent}
                />
            )
        })
    }

    return (
        <Page id="dashboard">
            <Container>
                <Masonry
                    breakpointCols={{ default: 6, 1200: 5, 992: 3, 768: 3, 576: 2, 575.98: 1 }}
                    className="flex-row align-items-start">
                    {renderWidgets()}
                </Masonry>
            </Container>
        </Page>
    );
};

export default Dashboard;
