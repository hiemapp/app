import App from './App';
import { createRoot } from 'react-dom/client';
import Providers from './Providers';
import { HashRouter } from 'react-router-dom';
import './styles/index.scss';
import '@tjallingf/react-utils/dist/style.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Providers>
    <HashRouter>
      <App />
    </HashRouter>
  </Providers>,
);
