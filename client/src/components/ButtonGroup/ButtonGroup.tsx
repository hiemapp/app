import classNames from 'classnames';
import { forwardRef, cloneElement, useState, useEffect } from 'react';
import './ButtonGroup.scss';
import { parseColor } from '@tjallingf/react-utils';

export interface ButtonGroupProps extends React.PropsWithChildren, Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    select?: 'single'|'multiple';
    size?: 'sm'|'lg';
    seperated?: boolean;
    onChange?: (value: any) => unknown;
    value?: any;
}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(({
    children, 
    className, 
    select = 'single', 
    size = 'sm',
    seperated = false,
    onChange,
    value,
    ...rest
}, ref) => {
    const [ activeValue, setActiveValue ] = useState(value);

    useEffect(() => {
        setActiveValue(value);
    }, [ value ]);

    const handleSelect = (value?: any) => {
        setActiveValue(value);

        if(typeof onChange === 'function') {
            onChange(value);
        }
    }

    if(Array.isArray(children)) {
        children = children.map((child, i) => {
            let value = child.props.value ?? i;

            const clone = cloneElement(child, {
                onClick: () => handleSelect(value),
                active: (activeValue === value),
                key: value
            })

            return clone;
        })
    }

    return (
        <div {...rest}
            className={classNames(className, 
                'ButtonGroup', `ButtonGroup--size-${size}`,
                {'ButtonGroup--seperated': seperated}
            )} 
            ref={ref}>
            {children}
        </div>
    )
})

export default ButtonGroup;