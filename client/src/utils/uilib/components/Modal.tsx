import OriginalModal from '@/components/Modal';
import { cloneElement, useMemo, useState } from 'react';

export interface ModalProps extends React.PropsWithChildren {
    trigger?: React.ReactElement,
    defaultIsOpen?: boolean;
}

export const Modal: React.FunctionComponent<ModalProps> = ({ trigger, defaultIsOpen, children }) => {
    const [ isOpen, setIsOpen ] = useState(!!defaultIsOpen);

    const clonedTrigger = useMemo(() => {
        if(!trigger) return;
        return cloneElement(trigger, {
            onClick: (e: any) => {
                setIsOpen(true);

                if(typeof trigger.props.onClick === 'function') {
                    return trigger.props.onClick(e)
                }
            }
        });
    }, [ trigger ]);

    return (
        <>
            {clonedTrigger}
            <OriginalModal 
                isOpen={isOpen} 
                onRequestClose={() => setIsOpen(false)}
                shouldCloseOnOverlayClick={true}>
                {children}
            </OriginalModal>
        </>
    )
}