import { Page, Container } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import DashboardWidget from '../components/DashboardWidget';
import type { SerializedNode } from 'zylax';
import { trpc } from '@/utils/trpc';
import app from '@/utils/app';
import useSocketEvent from '@/hooks/useSocketEvent';

const Dashboard: React.FunctionComponent = () => {
    const widgetSlugs: string[] = app().currentUser.getSetting('dashboardWidgets') ?? [];

    const widgetQueries = trpc.useQueries(t =>
        widgetSlugs.map(slug => t.dashboard.getRenderedWidget({ slug }))
    );

    const widgets = widgetQueries.map(q => {
        if(q.isLoading || !q.data?.content || !q.data?.manifest) return null;

        return (
            <DashboardWidget 
                manifest={q.data.manifest}
                content={q.data.content}
                handleWidgetNodeEvent={handleWidgetNodeEvent}
            />
        )
    })

    useSocketEvent('dashboard:widgetupdate', e => {
        console.log({e });
        widgetQueries.forEach(q => {
            console.log({ q });
            if(q.isSuccess && q.data?.sessionId === e.widgetSessionId) {
                q.refetch();
            }
        })
    })

    function handleWidgetNodeEvent(e: React.SyntheticEvent, node: SerializedNode) {
        console.log({ e, node });
    }


    return (
        <Page id="dashboard">
            <Container>
                <Masonry
                    breakpointCols={{ default: 6, 1200: 5, 992: 3, 768: 3, 576: 2, 575.98: 1 }}
                    className="flex-row align-items-start">
                    {widgets}
                </Masonry>
            </Container>
        </Page>
    );
};

export default Dashboard;
