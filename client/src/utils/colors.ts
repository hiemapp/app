import { colorpalettes } from '@tjallingf/react-utils';
const { red } = colorpalettes;
const a = red[3];

const BODY_COMPUTED_STYLE = window.getComputedStyle(document.body);

export function getColorValue(color: (typeof colorpalettes)[0][0]): string {
    return BODY_COMPUTED_STYLE.getPropertyValue(`--${color.name}-${color.intensity}`);
}

export function parseColor(color: string, lightness: number = 5, fallback: string = 'blue') {
    if(color.startsWith('$')) {
        return (colorpalettes[color.substring(1)] ?? colorpalettes[fallback])[lightness];
    }

    return color;
}

const colors = {};
export default colors;
