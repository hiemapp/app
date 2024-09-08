import { Button, Icon, palettes } from '@tjallingf/react-utils';
import './ListItem.scss';
import classNames from 'classnames';

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
    palette?: any;
    icon?: string;
    title: any;
    description?: any;
}

const ListItem: React.FunctionComponent<ListItemProps> = ({
    palette = palettes.BLUE,
    className,
    icon,
    title,
    description,
    style, 
    onClick,
    ...rest
}) => {

    function renderChildren() {
        const children = (
            <div className="d-flex flex-row h-100 w-100">
                {icon && (
                    <div className="ListItem__marker rounded position-relative">
                        <Icon id={icon} weight="solid" />
                    </div>
                )}
                <div className="ListItem__content overflow-hidden d-flex flex-column w-100">
                    <h6 className="text-truncate">{title}</h6>
                    <p className="text-muted m-0 text-truncate mt-auto">{description}</p>
                </div>
            </div>
        );

        if(onClick) {
            return (
                <Button variant="secondary" className="ListItem__button" onClick={onClick as any} role="button">
                    {children}
                </Button>
            )
        }

        return children;
    }

    return (
        <li 
            {...rest}
            className={classNames('ListItem rounded-end', className)}
            style={{
            ...style,
            '--ListItem-accent-2': palette[2],
            '--ListItem-accent-4': palette[4],
            '--ListItem-accent-7': palette[5]
        } as React.CSSProperties}>
            {renderChildren()}
        </li>
    )
}

export default ListItem;