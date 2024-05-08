import classNames from 'classnames';
import { Box, Button, Icon, Tile } from '@tjallingf/react-utils';
import './DropdownItem.scss';
import { getPointer } from '@/utils/events';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface DropdownItemProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'title'> {
    title?: React.ReactNode;
    label?: React.ReactNode;
    value?: any;
}

const DropdownItem: React.FunctionComponent<DropdownItemProps> = ({
    title,
    label,
    value,
    children,
    className,
    ...rest
}) => {
    const renderContent = () => {
        if(children) return children;

        return (
            <>
                {label && <span className="DropdownItem__label">{label}</span>}
                <h6 className="DropdownItem__title">{title ?? value}</h6>
            </>
        )
    }

    return (
        <Box direction="column">
            {renderContent()}
        </Box>
    )
}

export default DropdownItem;