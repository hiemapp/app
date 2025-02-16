import { Box, Container, Icon } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import { Suspense, lazy } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import { useIntl } from 'react-intl';
import { getMessageId } from '@/utils/language';
import { useParams } from 'react-router';

const RecordsGraph = lazy(() => import('../../components/records/RecordsGraph'));

const Records: React.FunctionComponent = () => {
    const deviceId = parseInt(useParams().deviceId!);
    const { formatMessage } = useIntl();
    
    const deviceQuery = trpc.device.get.useQuery({ id: deviceId });
    const manifestQuery = trpc.device.getDriverManifest.useQuery({ id: deviceId });
    const recordQuery = trpc.record.listToday.useQuery({ id: deviceId })

    const getFieldLabel = (name: string) => {
        if(!recordQuery.data?.records || !manifestQuery.data?.recording?.fields || !deviceQuery.data) return;
        const messageId = getMessageId(deviceQuery.data.driver.type!, 'devices.drivers', `recording.fields.${name}.label`);
        
        return formatMessage({ id: messageId, defaultMessage: name });
    }

    const renderGraph = () => {
        if(recordQuery.isLoading|| manifestQuery.isLoading || deviceQuery.isLoading) return <LargeLoadingIcon />;
        
        if(!Array.isArray(recordQuery.data?.records)) 
            throw new Error('Failed to load records.');

        if(!Array.isArray(manifestQuery.data?.recording?.fields)) 
            throw new Error('Failed to load recording fields manifest.');

        return (
            <Suspense fallback={<LargeLoadingIcon />}>
                <RecordsGraph 
                    fields={manifestQuery.data.recording.fields} 
                    records={recordQuery.data.records} 
                    getFieldLabel={getFieldLabel} />
            </Suspense>
        )
    }


    return (
        <Page id="records">
            <Container className="h-100">
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