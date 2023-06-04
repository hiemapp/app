import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import ExpressMySQLSession from 'express-mysql-session';
import passportService from './express/auth/services/passport';
import { WebSocket, Database, Config, logger } from 'zylax';
import { trpcMiddleware } from './express/middleware/trpcMiddleware';
import { utils } from 'zylax';
const { getDir } = utils;

const MySQLStore = ExpressMySQLSession(session as any);
export const serverLogger = logger.child({ label: 'Server' });

export function start() {
    const server = express();

    // Parse cookies
    server.use(cookieParser());

    // Setup static directory
    server.use(express.static(getDir('PUBLIC')));

    // Allow CORS
    server.use(cors());

    // Disable 'X-Powered-By' header
    server.disable('x-powered-by');

    // Setup Passport.js middleware
    serverLogger.debug('Setting up Passport.js middleware...');
    server.use(
        session({
            secret: passportService.getOrCreateSecret(),
            resave: false,
            saveUninitialized: false,
            store: new MySQLStore({}, Database.connection),
        }),
    );
    server.use(passport.authenticate('session'));

    // Initialize Passport.js
    serverLogger.debug('Initializing Passport.js...');
    passportService.init();

    // Add tRPC middleware
    serverLogger.debug('Setting up tRPC middleware...');
    server.use('/trpc', trpcMiddleware);

    // Get web port
    const serverPort = Config.get('system.server.port');
    const serverWithWebsocket = WebSocket.setup(server);

    serverLogger.debug(`Starting server on port ${serverPort}...`);
    serverWithWebsocket.listen(serverPort, () => {
        serverLogger.info(`Listening at http://localhost:${serverPort}.`);
    });
}
