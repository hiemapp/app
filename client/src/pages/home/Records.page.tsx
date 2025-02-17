import { Box, Button, Container, Icon } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import { useIntl } from 'react-intl';
import { getMessageId } from '@/utils/language';
import { useParams } from 'react-router';
import ButtonGroup from '@/components/ButtonGroup';
import RecordsGraphToolbar from '@/components/records/RecordsGraphToolbar';

const RecordsGraph = lazy(() => import('../../components/records/RecordsGraph'));

const Records: React.FunctionComponent = () => {
    const deviceId = parseInt(useParams().deviceId!);
    const { formatMessage } = useIntl();
    const [ period, setPeriod ] = useState<Date[]>([]);
    
    const deviceQuery = trpc.device.get.useQuery({ id: deviceId });
    const manifestQuery = trpc.device.getDriverManifest.useQuery({ id: deviceId });
    const recordQuery = trpc.record.listPeriod.useQuery({ id: deviceId, start: period[0], end: period[1] }, { enabled: false });

    useEffect(() => {
        if(period.length >= 2) {
            recordQuery.refetch();
        }
    }, [ period ]);

    const getFieldLabel = (name: string) => {
        if(!recordQuery.data?.records || !manifestQuery.data?.recording?.fields || !deviceQuery.data) return;
        const messageId = getMessageId(deviceQuery.data.driver.type!, 'devices.drivers', `recording.fields.${name}.label`);
        
        return formatMessage({ id: messageId, defaultMessage: name });
    }

    const handlePeriodChange = (start: Date, end: Date) => {
        setPeriod([ start, end ]);
        console.log(start, end);
    }

    const renderGraph = () => {
        if(manifestQuery.isLoading || deviceQuery.isLoading) return <LargeLoadingIcon />;
        
        if(!recordQuery.isLoading && !Array.isArray(recordQuery.data?.records)) 
            throw new Error('Failed to load records.');

        if(!Array.isArray(manifestQuery.data?.recording?.fields)) 
            throw new Error('Failed to load recording fields manifest.');

        return (
            <Suspense fallback={<LargeLoadingIcon />}>
                <RecordsGraph 
                    fields={manifestQuery.data.recording.fields} 
                    records={recordQuery.isLoading ? [] : recordQuery.data!.records} 
                    getFieldLabel={getFieldLabel} />
            </Suspense>
        )
    }


    return (
        <Page id="records">
            <Container className="h-100">
                <RecordsGraphToolbar onPeriodChange={handlePeriodChange} />
                {renderGraph()}
            </Container>
        </Page>
    )
}

export default Records;