import { Database, Config, logger, DeviceController, FlowController, UserController, ExtensionController, LanguageController, Taskrunner, Extension } from 'zylax';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as server from './server';
import path from 'path';

// Check if the server has root privileges
if (typeof process.getuid == 'function' && process.getuid() !== 0) {
    throw new Error('The server must be started with root privileges.');
}

// Force NODE_ENV to be either 'development' or 'production'
process.env.NODE_ENV =
    process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_script?.endsWith?.('.ts')
        ? 'development'
        : 'production';

// Check whether the server is running in development or production
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
    
    // Start the taskrunner timer
    Taskrunner.startTimer();

    // Load controllers
    logger.debug('Initializing controllers...');
    await UserController.load();
    await ExtensionController.load();
    await DeviceController.load();
    await FlowController.load();
    LanguageController.load();

    // Reload all flows
    FlowController.index().forEach(flow => {
        flow.reload();
    })

    // Start the webserver
    logger.debug('Starting server...');
    server.start();
})();
