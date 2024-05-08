import classNames from 'classnames';
import './Popup.scss';
import { useState } from 'react';
import { cloneElement } from 'react';

export interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
    trigger: React.ReactElement;
    connect?: 'top' | 'right' | 'bottom' | 'left';
    spacing: string | number
}

const Popup: React.FunctionComponent<PopupProps> = ({
    trigger,
    children,
    connect = 'top',
    spacing,
    ...rest
}) => {
    const [ show, setShow ] = useState(false);

    const modifiedTrigger = cloneElement(trigger, {
        active: show
    });

    return (
        <div {...rest}
        className={classNames('Popup', {'Popup--show': show}, `Popup--connect-${connect}`, rest.className)}
        style={{
            ...rest.style,
            '--Popup-spacing': typeof spacing === 'number' ? spacing+'px' : spacing
        } as any}>
            <div className="Popup__trigger" onClick={() => setShow(v => !v)}>
                {modifiedTrigger}
            </div>
            <div className="Popup__content">
                {children}
            </div>
        </div>
    )
}

export default Popup;