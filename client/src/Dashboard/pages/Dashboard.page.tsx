import { Page, Container } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import DashboardWidget from '../components/DashboardWidget';
import { trpc } from '@/utils/trpc';
import app from '@/utils/app';
import useSocketEvent from '@/hooks/useSocketEvent';

const Dashboard: React.FunctionComponent = () => {
    const widgetSlugs: string[] = app().currentUser.getSetting('dashboardWidgets') ?? [];
    const widgetEventMutation = trpc.dashboard.handleWidgetEvent.useMutation();

    const widgetQueries = trpc.useQueries(t =>
        widgetSlugs.map(slug => t.dashboard.getRenderedWidget({ slug }))
    );

    const widgets = widgetQueries.map(q => {
        if(q.isLoading || !q.data?.manifest) return null;

        return (
            <DashboardWidget 
                key={q.data.sessionId}
                manifest={q.data.manifest}
                content={q.data.content!}
                eventHandler={(listenerId: string) => {
                    widgetEventHandler(q.data.sessionId, listenerId);
                }}
            />
        )
    })

    useSocketEvent('widgets:update', e => {
        widgetQueries.forEach(q => {
            if(q.isSuccess && q.data?.sessionId === e.widgetSessionId) {
                q.refetch();
            }
        })
    })

    function widgetEventHandler(sessionId: string, listenerId: string) {
        widgetEventMutation.mutate({
            sessionId,
            listenerId
        })
    }


    return (
        <Page id="dashboard">
            <Container>
                <Masonry
                    breakpointCols={{ default: 4, 1200: 3, 992: 2, 576: 1 }}
                    className="flex-row align-items-start">
                    {widgets}
                </Masonry>
            </Container>
        </Page>
    );
};

export default Dashboard;
