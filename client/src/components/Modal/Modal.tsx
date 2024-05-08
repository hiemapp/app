import ReactModal from 'react-modal';
import classNames from 'classnames';
import { Box } from '@tjallingf/react-utils';
import './Modal.scss';
import React from 'react';

export type ModalProps = Omit<ReactModal.Props, 'children'> & React.PropsWithChildren & {
    className?: string
}

const Modal: React.FunctionComponent<ModalProps> = ({
    children,
    className,
    ...rest
}) => {
    return (
        <ReactModal {...rest} className={classNames('Modal', className)} closeTimeoutMS={300}>
            <Box direction="column" gutterY={2} justify="center" align="center">
                <div className="Modal__body">
                    {children}
                </div>
            </Box>
        </ReactModal>
    )
}

export default Modal;