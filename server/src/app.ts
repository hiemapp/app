import path from 'path';
import boot from './boot/_index';

// Force NODE_ENV to be either 'development' or 'production'
if (process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production';
}

// Check if the server has root privileges
if (typeof process.getuid == 'function' && process.getuid() !== 0) {
    throw new Error('The server must be started with root privileges.');
}

// resolve root dir and boot server
const rootDir = path.dirname(__dirname);
boot(rootDir);