import { Box as OldBox } from '@tjallingf/react-utils';

export const Box = (immutableProps: any) => {
    const props = {...immutableProps};
    
    if(props.justify) {
        props.justify = props.justify.replace('space-', '');
    }

    props.gutterX = props.gx;
    delete props.gx;

    props.gutterY = props.gy;
    delete props.gy;

    return <OldBox {...props} />;
}