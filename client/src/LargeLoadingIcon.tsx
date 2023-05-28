import { Box, LoadingIcon } from '@tjallingf/react-utils';

export interface LargeLoadingIconProps extends React.PropsWithChildren {
    label?: string | React.ReactNode
}

// The loading icon element is stored outside of the component
// to prevent 'jumps' in the animation when rerendering.
const LoadingIconElement = <LoadingIcon size={28} animated />;

const LargeLoadingIcon: React.FunctionComponent<LargeLoadingIconProps> = ({
    label
}) => {
    return (
        <Box 
            align="center" 
            justify="center" 
            direction="column" 
            className="LargeLoadingIcon h-100 w-100">
            {LoadingIconElement}
            {label && <span className="mt-1">{label}</span>}
        </Box>
    )
}

export default LargeLoadingIcon;