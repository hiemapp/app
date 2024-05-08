import classNames from 'classnames';
import { Box, Color, parseColor } from '@tjallingf/react-utils';
import './Progress.scss';
import React, { useEffect, useRef, useState } from 'react';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onInput'> {
    className?: string;
    direction?: 'horizontal' | 'vertical';
    min: number;
    max: number;
    value: number;
    editable?: boolean;
    onChange?: (value: number) => unknown;
    onInput?: (value: number) => unknown;
    trackColor?: any;
    handleColor?: any;
    thumbColor?: any;
    length?: number | string;
    showHandle?: boolean;
}

const Progress: React.FunctionComponent<ProgressProps> = ({
    className,
    min,
    max,
    value,
    showHandle = false,
    editable = false,
    onInput,
    onChange,
    direction = 'horizontal',
    trackColor,
    handleColor,
    thumbColor,
    length = 200,
    ...rest
}) => {
    const [ isDragging, setIsDragging ] = useState(false);
    const [ draggingPos, setDraggingPos ] = useState<number>(0);
    // const [ showPos, setShowPos ] = useState<number>(defaultValue ?? min);
    const progressRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if(typeof value !== 'number') return;
    //     setUserPos(value);
    // }, [ value ]);

    const userPos = (value-min) / (max-min) * 100;
    const pos = isDragging ? draggingPos : userPos;
    const clampedPos = Math.min(Math.max(pos, 0), 100);

    useEffect(() => {
        if(!editable) return;

        if(progressRef.current) {
            progressRef.current.addEventListener('mousedown', handleDragStart);
            progressRef.current.addEventListener('touchstart', handleDragStart, { passive: true });  
        }

        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchend', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove);

        return () => {
            if(progressRef.current) {
                progressRef.current.removeEventListener('mousedown', handleDragStart);
                progressRef.current.removeEventListener('touchstart', handleDragStart);  
            }

            window.removeEventListener('mouseup', handleDragEnd)
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
        }
    });
    
    function handleDragStart(e: MouseEvent | TouchEvent) {
        // Only respond to left mouse button down
        if(e instanceof MouseEvent && e.button !== 0) return;
        preventDefault(e);

        setIsDragging(true);
        handleDragMove(e);
    }

    function handleDragEnd(e: MouseEvent | TouchEvent) {
        if(!isDragging) return;
        preventDefault(e);
        setIsDragging(false);

        if(typeof onChange === 'function') {
            onChange(toValue(draggingPos));
        }
    }

    function handleDragMove(e: MouseEvent | TouchEvent) {
        preventDefault(e);
        const pos = calculatePos(e);
        setDraggingPos(pos);

        if(typeof onInput === 'function') {
            onInput(toValue(pos));
        }
    }

    function preventDefault(e: MouseEvent | TouchEvent){
        if(e instanceof TouchEvent) return;
        if(e.preventDefault) e.preventDefault();
    }

    function toValue(pos: number) {
        const value = pos / 100 * (max-min) + min;
        const clampedValue = Math.min(Math.max(value, min), max);
        return clampedValue;
    }

    function calculatePos(e: MouseEvent | TouchEvent): number {
        if(!progressRef.current) return 0;
        const rect = progressRef.current.getBoundingClientRect()

        let data: MouseEvent = (e as any).touches?.[0] ?? e;
        if(typeof data.pageX !== 'number') return 0;

        const progressLength = direction === 'horizontal' ? rect.width : rect.height;
        const cursorPos = direction === 'horizontal' ? data.pageX - rect.left : rect.bottom - data.pageY;

        return cursorPos / progressLength * 100;
    }

    return (
        <div {...rest}
            className={classNames(
                'Progress', 'user-drag-none', 
                `Progress--direction-${direction}`, 
                {'Progress--show-handle': showHandle},
                {'Progress--dragging': isDragging},
                className
            )}
            ref={progressRef}
            style={{
                ...rest.style,
                '--Progress-position': clampedPos,
                '--Progress-value': value,
                '--Progress-max': max,
                '--Progress-min': min,
                '--Progress__track-bg': parseColor(trackColor, true),
                '--Progress__handle-bg': parseColor(handleColor, true),
                '--Progress__thumb-bg': parseColor(thumbColor, true),
                '--Progress-length': typeof length === 'number' ? length+'px' : length
            } as any}>
            <div className="Progress__track"></div>
            <div className="Progress__thumb"></div>
            <div className="Progress__handle"></div>
        </div>
    )
}

export default Progress;