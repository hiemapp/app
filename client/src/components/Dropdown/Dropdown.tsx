import classNames from 'classnames';
import { Box, Button, Icon, Tile } from '@tjallingf/react-utils';
import './Dropdown.scss';
import { getPointer } from '@/utils/events';
import React, { Children, ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: any;
    renderLabel?: (activeItem: React.ReactElement) => React.ReactNode
}

const Dropdown: React.FunctionComponent<DropdownProps> = ({
    className,
    children,
    defaultValue,
    renderLabel,
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const items = Children.toArray(children) as React.ReactElement[];

    const activeItem = useMemo(() => {
        return items.find(item => (item as ReactElement).props.value === defaultValue) ?? items[0];
    }, [ defaultValue ]);

    const renderListItems = () => {
        return items.map(item => {
            return (
                <Button className="Dropdown__list-item" variant="secondary" active={item.props.value === activeItem.props.value}>
                    {item}
                </Button>
            )
        })
    }

    return (
        <div className={classNames('Dropdown', { 'Dropdown--open': isOpen }, className)} {...rest}>
            <Button className="Dropdown__trigger" variant="secondary" onClick={() => setIsOpen(o => !o)} active={isOpen}>
                <Box direction="row" gutterX={2}>
                    <span className="Dropdown__label">{
                        typeof renderLabel === 'function'
                            ? renderLabel(activeItem)
                            : activeItem
                    }</span>
                    <Icon id="chevron-down" color="$text-primary" />
                </Box>
            </Button>
            <div className="Dropdown__menu">
                <Box direction="column" className="Dropdown__list">
                    {renderListItems()}
                </Box>
            </div>
        </div>
    )
}

export default Dropdown;