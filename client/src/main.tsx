import './styles/index.scss';
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/light.min.css';
import './assets/fontawesome/css/solid.min.css';
import '@tjallingf/react-utils/dist/style.css';

import App from './App';
import { createRoot } from 'react-dom/client';
import Providers from './Providers';
import { HashRouter } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const root = createRoot(document.getElementById('root')!);

root.render(
  <Providers>
    <HashRouter>
      <App />
    </HashRouter>
  </Providers>,
);
