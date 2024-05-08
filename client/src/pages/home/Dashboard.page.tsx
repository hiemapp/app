// @ts-nocheck
import { Page, Container } from '@tjallingf/react-utils';
import Masonry from '@/Views';
import DashboardWidget from '../../components/dashboard/DashboardWidget';
import { trpc } from '@/utils/trpc/trpc';
import appState from '@/utils/appState';
import useSocketEvent from '@/hooks/useSocketEvent';

const Dashboard: React.FunctionComponent = () => {
    const widgetSlugs: string[] = appState.currentUser.getSetting('dashboardWidgets') ?? [];
    const widgetEventMutation = trpc.dashboard.handleWidgetEvent.useMutation();

    const widgetQueries = trpc.useQueries(t =>
        widgetSlugs.map(slug => t.dashboard.getRenderedWidget({ slug }))
    );

    useSocketEvent('widget:update', e => {
        widgetQueries.forEach(q => {
            if(q.isSuccess && q.data?.sessionId === e.widgetSessionId) {
                q.refetch();
            }
        })
    })

    const widgets = widgetQueries.map(q => {
        if(q.isLoading || !q.data?.manifest) return null;

        return (
            <DashboardWidget 
                key={q.data.sessionId}
                data={q.data}
                dataUpdatedAt={q.dataUpdatedAt}
                eventHandler={(listenerId: string) => {
                    widgetEventHandler(q.data.sessionId, listenerId);
                }}
            />
        )
    })

    function widgetEventHandler(sessionId: string, listenerId: string) {
        widgetEventMutation.mutate({
            sessionId,
            listenerId
        })
    }


    return (
        <Page id="Dashboard">
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
