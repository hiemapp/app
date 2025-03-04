import ButtonGroup from '@/components/ButtonGroup';
import { Box, Button, Icon } from '@tjallingf/react-utils';
import { useEffect, useState } from 'react';
import './RecordsGraphToolbar.scss';
import dayjs, { OpUnitType } from 'dayjs';

export interface RecordsGraphToolbarProps extends React.PropsWithChildren {
    onPeriodChange?: (start: Date, end: Date) => unknown
}

const UNITS = ['hour', 'day', 'week', 'month', 'year'];

const RecordsGraphToolbar: React.FunctionComponent<RecordsGraphToolbarProps> = ({
    onPeriodChange
}) => {
    const [ activeUnit, setActiveUnit ] = useState<Exclude<OpUnitType, 'date' | 'dates'>>('hour');
    const [ activeDate, setActiveDate ] = useState(new Date());

    useEffect(() => {
        if(typeof onPeriodChange === 'function') {
            const [start, end] = getPeriod();
            onPeriodChange(start, end);
        }
    }, [ activeUnit, activeDate ]);

    const moveDate = (offset: number) => {
        setActiveDate(date => {
            const dt = dayjs(date).add(offset, activeUnit)
            return dt.toDate();
        });
    }
    
    const getPeriod = (): [Date, Date] => {
        const start = dayjs(activeDate).startOf(activeUnit);
        const end = dayjs(activeDate).endOf(activeUnit);

        return [ start.toDate(), end.toDate() ];
    }

    const getLabels = () => {
        const start = dayjs(activeDate).startOf(activeUnit);
        const end = dayjs(activeDate).endOf(activeUnit);

        switch(activeUnit) {
            case 'hour':
                return [ dayjs(start).format('DD-MM-YYYY HH:mm'), dayjs(end).format('HH:mm') ];
            case 'day':
                return [ dayjs(start).format('DD-MM-YYYY') ]
            case 'week':
                return [ dayjs(start).format('DD-MM-YYYY'), dayjs(end).format('DD-MM-YYYY') ]
            case 'month':
                return [ dayjs(start).format('MM-YYYY') ]
            case 'year':
                return [ dayjs(start).format('YYYY') ]
        }

        return [];
    }

    const renderLabel = () => {
        const [ start, end ] = getLabels();

        return (<>
            {start}
            {end && (<>
                <span> - </span>
                {end}
            </>)}
        </>)
    }
    
    return (
        <div className="RecordsGraphToolbar">
            <Box direction="row" gutterX={3} align="center">
                <ButtonGroup className="RecordsGraphToolbar__unit-selector" onChange={setActiveUnit} value={activeUnit}>
                    {UNITS.map(unit => (
                        <Button 
                            variant="unstyled" 
                            value={unit}>{unit}</Button>
                    ))}
                </ButtonGroup>
                <Box className="RecordsGraphToolbar__time-selector" align="stretch">
                    <Button variant="primary" onClick={() => moveDate(-1)}>
                        <Icon id="chevron-left" size={16} />
                    </Button>
                    <Box className="RecordsGraphToolbar__time-selector__label" align="center">
                        {renderLabel()}
                    </Box>
                    <Button variant="primary" onClick={() => moveDate(1)}>
                        <Icon id="chevron-right" size={16} />
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default RecordsGraphToolbar;