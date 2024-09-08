import classNames from 'classnames';
import React from 'react';
import './List.scss';

export interface ListProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLUListElement> {
    
}

const List: React.FunctionComponent<ListProps> = ({
    children, className, ...rest
}) => {
    return (
        <ul className={classNames('List', className)} {...rest}>
            {children}
        </ul>
    )
}

export default List;