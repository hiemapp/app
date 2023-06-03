import { SpriteContext } from '@tjallingf/react-utils';
import iconSpriteLight from '@/icons/sprites/light.svg';
import iconSpriteSolid from '@/icons/sprites/solid.svg';

const SpriteProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const value = {
        icons: {
            light: iconSpriteLight,
            solid: iconSpriteSolid
        }
    };
    
    return <SpriteContext.Provider value={value}>{children}</SpriteContext.Provider>;
};

export default SpriteProvider;
