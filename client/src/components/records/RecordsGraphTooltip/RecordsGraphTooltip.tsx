import { TooltipProps } from 'recharts';
import dayjs from 'dayjs';
import './RecordsGraphTooltip.scss';
import { Box } from '@tjallingf/react-utils';

export type RecordsGraphTooltipProps = TooltipProps<number, string>;

const RecordsGraphTooltip: React.FunctionComponent<RecordsGraphTooltipProps> = ({
    active, payload
}) => {
    // if(!payload?.length) return null;

    payload = payload?.length ? payload : [ { payload: { $time: 0 }}];
    const date = dayjs(payload[0].payload.$time);

    if (active) {
        return (
            <div className="RecordsGraphTooltip">
                <h3 className="RecordsGraphTooltip__title fw-bold mb-1">
                    <span className="RecordsGraphTooltip__date">{date.format('DD-MM-YYYY')}&nbsp;</span>
                    <span className="RecordsGraphTooltip__time">{date.format('HH:mm:ss')}</span>
                </h3>
                <ul className="list-unstyled">
                    {payload.map(item => (
                        <li className="RecordsGraphTooltip__item" style={{'--RecordsGraphTooltip__item-accent': item.stroke} as React.CSSProperties}>
                            <Box direction="row" align="center" gutterX={2}>
                                <span className="RecordsGraphTooltip__item-marker"></span>
                                <span className="RecordsGraphTooltip__item-label">{item.name}</span>
                                <span className="RecordsGraphTooltip__item-value ms-auto ps-3">{item.value}</span>
                            </Box>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return null;
}

export default RecordsGraphTooltip;