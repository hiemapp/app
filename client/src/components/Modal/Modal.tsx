import ReactModal from 'react-modal';
import classNames from 'classnames';
import { Box, Button, Icon } from '@tjallingf/react-utils';
import './Modal.scss';
import { getPointer } from '@/utils/events';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const MODAL_CLOSE_SWIPE_DISTANCE_PX = 100;
const MODAL_CLOSE_SWIPE_VELOCITY = 0.3;

export interface ModalProps extends Omit<ReactModal.Props, 'children' | 'style' | 'role'>, React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
    className?: string
    title?: string;
    originRef?: React.MutableRefObject<HTMLElement|undefined|null>;
    align?: 'start' | 'center' | 'end' | 'stretch';
}

export interface ModalDataRef {
    original: {
        handleRect: DOMRect;
        modalRect: DOMRect;
        pageY: number;
    }
    start: {
        handleRect: DOMRect;
        modalRect: DOMRect;
        pageY: number;
        time: number;
    }
    posY: number;
}

const Modal: React.FunctionComponent<ModalProps> = ({
    children,
    className,
    title,
    style,
    isOpen,
    align = 'center',
    originRef,
    ...rest
}) => {
    const modalRef = useRef<ReactModal>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const [ isDragging, setIsDragging ] = useState(false);
    const dataRef = useRef<ModalDataRef>({} as any);
    const modalDiv = modalRef.current?.portal?.content;
    const [ originPos, setOriginPos ] = useState<Array<string|null>>([null, null]);

    // Find trigger position on first render
    useLayoutEffect(() => {
        updateOriginPos();
    }, [ isOpen ]);
    
    useEffect(() => {
        window.addEventListener('mouseup', onHandleBlur);
        window.addEventListener('touchend', onHandleBlur);
        window.addEventListener('mousemove', onHandleMove);
        window.addEventListener('touchmove', onHandleMove, { passive: false });
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('mouseup', onHandleBlur);
            window.removeEventListener('touchend', onHandleBlur);
            window.removeEventListener('mousemove', onHandleMove);
            window.removeEventListener('touchmove', onHandleMove);
            window.removeEventListener('resize', onWindowResize);
        }
    });

    function updateOriginPos() {
        if(!originRef?.current) return;

        const triggerPos = originRef.current.getBoundingClientRect();
        setOriginPos([ 
            triggerPos.left+triggerPos.width/2+'px', 
            triggerPos.top+triggerPos.height/2+'px'
        ])
    }

    function onWindowResize(e: any) {
        console.log('AAA');
        updateOriginPos();
    }

    function onHandleFocus(e: any) {
        if(!handleRef.current || !modalRef.current?.portal?.content) return;

        const { pageY } = getPointer(e);
        setIsDragging(true);

        dataRef.current.start = {
            pageY: pageY,
            handleRect: handleRef.current.getBoundingClientRect(),
            modalRect: modalRef.current.portal.content.getBoundingClientRect(),
            time: Date.now()
        }

        if(!dataRef.current.original) {
            dataRef.current.original = dataRef.current.start;
        }

        setPosition(0);
    }

    function onHandleMove(e: any) {
        if(!handleRef.current || !modalRef.current) return;
        if(!isDragging) return;

        // Prevent window scroll when the modal is open
        e.preventDefault();

        const { pageY } = getPointer(e);
        const posY = pageY - dataRef.current.start.pageY + dataRef.current.start.handleRect.top - dataRef.current.original.handleRect.top;

        setPosition(posY);
    }

    function onHandleBlur(e: any) {
        if(!isDragging) return;
        setIsDragging(false);

        const posY = dataRef.current.posY;
        const timeDiff = Date.now() - dataRef.current.start.time;
        const distanceDiff = posY;
        const velocity = distanceDiff / timeDiff;
        const shouldClose = velocity > MODAL_CLOSE_SWIPE_VELOCITY || posY > MODAL_CLOSE_SWIPE_DISTANCE_PX;
        
        if(shouldClose) {
            if(typeof rest.onRequestClose === 'function') {
                rest.onRequestClose(e);
            }
        }
    }

    function setPosition(posY: number) {
        if(!modalDiv) return;

        posY = Math.max(0, posY);
        modalDiv.style.setProperty('--Modal-dragging-position', posY+'px');
        dataRef.current.posY = posY;
    }
    return (
        <ReactModal 
            className={classNames(
                'Modal', 'd-flex', 'flex-column', `Modal--origin-${originRef ? 'dynamic' : 'center'}`,
                { 'Modal--dragging': isDragging },
                className
            )} 
            closeTimeoutMS={325} 
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            style={{ 
                content: {
                    ...style,
                    '--Modal-origin-x': originPos[0],
                    '--Modal-origin-y': originPos[1]
                } as React.CSSProperties
            }}
            ref={modalRef}
            shouldReturnFocusAfterClose={false}
            isOpen={isOpen}
            {...rest}>
            <Box direction="column" justify="center" align="center" className="overflow-hidden">
                <Box className="Modal__handle" direction="row" justify="center">
                    <div className="Modal__handle-target"
                        onTouchStart={onHandleFocus} 
                        onMouseDown={onHandleFocus}
                        ref={handleRef} />
                    <div className="Modal__handle-indicator"></div>
                </Box>
                <Box className="Modal__header" align="center">
                    <h2 className="Modal__title w-100">
                        {title}
                    </h2>
                    <Button className="Modal__close-button ms-auto" square variant="secondary" onClick={rest.onRequestClose}>
                        <Icon id="times" size={24} />
                    </Button>
                </Box>
                <Box className="Modal__body" direction="column" align={align}>
                    {children}
                </Box>
            </Box>
        </ReactModal>
    )
}

export default Modal;