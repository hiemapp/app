import { Database, Config, logger, DeviceController, FlowController, UserController, ExtensionController, LanguageController, Taskrunner, ScriptController, NotificationEmitter, User, Device, MutableRecord } from 'zylax';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Webserver from './Webserver';
import path from 'path';
import crypto from 'crypto';
import { Socket } from 'socket.io';
import userMiddleware from './websocket/middleware/userMiddleware';
import 'dotenv/config';

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
    await DeviceController.load();
    await FlowController.load();
    LanguageController.load();

    // Initialize the webserver
    Webserver.init();

    // Add user middleware to websocket
    Webserver.io.use(userMiddleware);

    Webserver.io.on('connection', socket => {
        socket.on('device:menuevent', (data: any) => {
            const device = DeviceController.find(data.deviceId);
            if(!device || !device.__stateMenuMemory) return;
            
            const callback = device.__stateMenuMemory.getChild(data.childIndex)?.callbacks?.[data.callbackId];  
            try {
                if(typeof callback === 'function') {
                    callback(...data.args);
                }
            } catch(err) {
                device.logger.error(err);
            }
        })
    })
    
    // Listen for notifications
    NotificationEmitter.on('notification', async e => {
        const props = await e.notification.getAllProps();
        const sockets = await Webserver.io.fetchSockets();

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
        device.on('update', () => {
            Webserver.io.emit('device:update', {
                deviceId: device.id
            });
        })

        device.on('update:menu', async e => {
            const state = await device.getDynamicProp('state');

            Webserver.io.emit('device:update:menu', {
                deviceId: device.id,
                menu: state.menu
            })      
        })
    })
    
    // Start the webserver
    logger.debug('Starting server...');
    Webserver.start();
})();