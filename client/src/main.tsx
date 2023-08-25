import App from './App';
import { createRoot } from 'react-dom/client';
import Providers from './Providers';
import { HashRouter } from 'react-router-dom';
import iconSpritesLight from '@/icons/sprites/light.svg';
import iconSpritesSolid from '@/icons/sprites/solid.svg';
import '@tjallingf/react-utils/dist/style.css';
import './styles/index.scss';
import Modal from 'react-modal';

(window as any).__ICON_SPRITES = {
    light: iconSpritesLight,
    solid: iconSpritesSolid
}

Modal.setAppElement('#root');

const root = createRoot(document.getElementById('root')!);

root.render(
  <Providers>
    <HashRouter>
      <App />
    </HashRouter>
  </Providers>,
);
