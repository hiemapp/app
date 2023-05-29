import './Icon.scss';
import classNames from 'classnames';
import lightSpriteFilepath from '@/icons/sprites/light.svg';
import solidSpriteFilepath from '@/icons/sprites/solid.svg';
import { parseColor } from '@/utils/colors';

const spriteFilepaths = {
    light: lightSpriteFilepath,
    solid: solidSpriteFilepath
} as const;

export interface IconProps {
    id?: string;
    size?: number | string | 'inherit';
    weight?: keyof typeof spriteFilepaths;
    className?: string;
    rotate?: number;
    children?: React.ReactNode;
    color?: string;
    lightness?: number;
}

const Icon: React.FunctionComponent<IconProps> = ({
    id,
    size = 20,
    weight = 'light',
    className,
    rotate,
    color = 'inherit',
    lightness,
    children
}) => {
    const getSize = () => {
        switch (typeof size) {
            case 'number':
                return size + 'px';
            case 'string':
                return size;
            default:
                return 'inherit';
        }
    };

    const style = {
        fontSize: getSize(),
        color: parseColor(color, lightness),
        '--Icon-rotate': rotate && rotate + 'deg'
    } as React.CSSProperties;

    // If children are passed, wrap them
    if (children) {
        return (
            <div className={classNames('Icon', 'Icon--type-wrapper', className)} style={style}>
                {children}
            </div>
        );
    }

    // If an id is passed, return the corresponding icon
    if (id) {
        return (
            <span 
                className={classNames(
                    'Icon',
                    'Icon--type-svg',
                    className
                )} 
                style={style}>
                <svg>
                    <use xlinkHref={`${spriteFilepaths[weight]}#${id}`}></use>
                </svg>
            </span>
        );
    }

    return null;
};

export default Icon;
