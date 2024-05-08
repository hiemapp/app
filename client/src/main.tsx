import './styles/index.scss';
import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/light.min.css';
import './assets/fontawesome/css/solid.min.css';
import '@tjallingf/react-utils/dist/style.css';

import MainView from './layouts/MainLayout/MainLayout';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import App from './App';
import { HashRouter } from 'react-router-dom';
import * as capacitor from './capacitor/setup';
import HomeController from './utils/homes/HomeController';

// Setup capacitor
capacitor.setup();

// Initialize HomeController
HomeController.init();

// Set react-modal root element
Modal.setAppElement('#root');

// Render React app
const root = createRoot(document.getElementById('root')!);
root.render(
  <HashRouter>
    <App>
      <MainView />
    </App>
  </HashRouter>
);
