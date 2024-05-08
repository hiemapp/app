import { Box, Container, Icon, LoadingIcon, Page } from '@tjallingf/react-utils';
import { Suspense, lazy } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import { useIntl } from 'react-intl';

const RecordsGraph = lazy(() => import('../../components/records/RecordsGraph'));

const Records: React.FunctionComponent = () => {
    const id = 16;

    const { formatMessage } = useIntl();

    const deviceQuery = trpc.device.get.useQuery({ id });
    const recordQuery = trpc.record.listLatest.useQuery({
        id: id,
        top: 600,
        skip: 0
    })

    const getDataSetLabel = (alias: string) => {
        if(!recordQuery.data?.fields || !deviceQuery.data) return null;

        const field = recordQuery.data.fields.find((field: any) => field.alias === alias);
        if(typeof field?.name !== 'string') return null;
        
        const driverConfig = deviceQuery.data.driver;
        console.log(driverConfig);
        if(typeof driverConfig?.type !== 'string') return field.name;

        const [ extId, driverModuleId ] = driverConfig.type.split('.');
        const messageId = `${extId}.deviceDrivers.${driverModuleId}.recording.fields.${field.name}.title`;
        
        return formatMessage({ id: messageId, defaultMessage: field.name });
    }

    const renderGraph = () => {
        if(!recordQuery.data?.dataSets|| deviceQuery.isLoading) {
            return <LargeLoadingIcon />
        }

        return (
            <Suspense fallback={<LargeLoadingIcon />}>
                <RecordsGraph deviceId={id} dataSets={recordQuery.data.dataSets} getDataSetLabel={getDataSetLabel} />
            </Suspense>
        )
    }


    return (
        <Page id="Records">
            <Container>
                <Box gutterX={1} align="center" className="mb-3">
                    <h2>Vandaag</h2>   
                    <Icon id="chevron-down" weight="solid" size={12} />
                </Box>
                {renderGraph()}
            </Container>
        </Page>
    )
}

export default Records;