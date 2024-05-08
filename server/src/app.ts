import { Database, Config, logger, DeviceController, ConnectorController, FlowController, UserController, ExtensionController, LanguageController, Taskrunner, NotificationEmitter, User, DashboardWidgetServer } from 'hiem';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import WebServer from './WebServer';
import path from 'path';
import crypto from 'crypto';
import { Socket } from 'socket.io';
import userMiddleware from './websocket/middleware/userMiddleware';

// Check if the server has root privileges
if (typeof process.getuid == 'function' && process.getuid() !== 0) {
    throw new Error('The server must be started with root privileges.');
}

// Force NODE_ENV to be either 'development' or 'production'
if(process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production';
}

// Promise handler
process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled promise rejection:', reason);
})

// Log whether the server is running in dev or prod mode
logger.info(`Starting in ${process.env.NODE_ENV} mode...`);

// Add day.js parser
dayjs.extend(customParseFormat);

(async function () {
    // Load the config
    logger.debug('Loading configuration...');
    const rootDir = path.dirname(__dirname);
    await Config.load(rootDir);

    // Connect to the database
    const dbConf = Config.get('secret.database');
    logger.debug(`Connecting to database '${dbConf.database}' as user '${dbConf.user}'...`);
    Database.connect(dbConf);

    // Start the taskrunner
    await Taskrunner.start();

    // Generate JWT secret if it doen't exist
    if(typeof Config.getOrFail('secret.jwtSecret') !== 'string') {
        logger.debug('Generating new JWT secret...');
        Config.update('secret.jwtSecret', crypto.randomBytes(256).toString('base64'));
    }
    
    // Load controllers
    logger.debug('Initializing controllers...');
    await UserController.load();
    await ExtensionController.load();
    await ConnectorController.load();
    await DeviceController.load();
    await FlowController.load();
    LanguageController.load();

    // Initialize the webserver
    WebServer.init();

    // Add user middleware to websocket
    WebServer.io.use(userMiddleware);
    
    // Listen for notifications
    NotificationEmitter.on('notification', async e => {
        const props = await e.notification.getAllProps();
        const sockets = await WebServer.io.fetchSockets();

        e.notification.getRecipients().forEach(recipient => {
            sockets.forEach(socket => {
                if(recipient instanceof User && socket.data.user.id !== recipient.id) return;
                if(recipient instanceof Socket && socket.id === recipient.id) return;

                socket.emit('notification', props);
            })
        })
    })

    // Add websocket event emitters
    DeviceController.index().forEach(device => {
        const eventHandler = () => {
            WebServer.io.sockets.emit('device:update', {
                device: { 
                    id: device.id,
                    state: device.getState(),
                    display: device.getDisplay()
                }
            });
        }
        
        device.on('state:update', eventHandler);
        device.on('connection:update', eventHandler);
    })

    // Start the webserver
    WebServer.start();

    // DashboardWidgetServer.start();
})();