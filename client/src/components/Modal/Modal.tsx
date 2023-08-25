import ReactModal from 'react-modal';
import classNames from 'classnames';
import { Box } from '@tjallingf/react-utils';
import './Modal.scss';
import React from 'react';

export interface ModalProps extends React.PropsWithChildren {
    /** Whether the modal is currently open. */
    open?: boolean;

    /** Whether the modal can be closed by clicking the overlay. */
    escapable?: boolean;

    className?: string;
    buttons?: React.ReactNode
}

const Modal: React.FunctionComponent<ModalProps> = ({
    open = false,
    escapable = false,
    children,
    buttons,
    className,
    ...rest
}) => {
    return (
        <ReactModal {...rest} 
            isOpen={open} 
            className={classNames('Modal', className)}
            shouldCloseOnOverlayClick={escapable}>
            <Box direction="column" gutterY={2}>
                <div className="Modal__body">
                    {children}
                </div>
                {buttons && (
                    <Box direction="row" className="Modal__buttons">
                        {buttons}
                    </Box>
                )}
            </Box>
        </ReactModal>
    )
}

export default Modal;