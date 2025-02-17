import ButtonGroup from '@/components/ButtonGroup';
import { Box, Button } from '@tjallingf/react-utils';
import { useEffect, useState } from 'react';
import './RecordsGraphToolbar.scss';
import dayjs, { OpUnitType } from 'dayjs';

export interface RecordsGraphToolbarProps extends React.PropsWithChildren {
    onPeriodChange?: (start: Date, end: Date) => unknown
}

const UNITS: OpUnitType[] = ['hour', 'day', 'week', 'month', 'year'];

const RecordsGraphToolbar: React.FunctionComponent<RecordsGraphToolbarProps> = ({
    onPeriodChange
}) => {
    const [ activeUnit, setActiveUnit ] = useState<OpUnitType>('hour');
    const [ activeDate, setActiveDate ] = useState(new Date());

    useEffect(() => {
        console.log('change!');
        if(typeof onPeriodChange === 'function') {
            const [start, end] = getPeriod();
            onPeriodChange(start, end);
        }
    }, [ activeUnit, activeDate ]);
    console.log({ activeUnit });
    
    const getPeriod = (): [Date, Date] => {
        const start = dayjs(activeDate).startOf(activeUnit);
        const end = dayjs(activeDate).endOf(activeUnit);

        return [ start.toDate(), end.toDate() ];
    }
    
    return (
        <div className="RecordsGraphToolbar">
            <Box direction="row" gutterX={3}>
                <ButtonGroup className="RecordsGraphToolbar__timespan-selector" onChange={setActiveUnit}>
                    {UNITS.map(unit => (
                        <Button 
                            variant="unstyled" 
                            value={unit}>{unit}</Button>
                    ))}
                </ButtonGroup>
                <h3>
                    17-02-2025
                </h3>
            </Box>
        </div>
    )
}

export default RecordsGraphToolbar;