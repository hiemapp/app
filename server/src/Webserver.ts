import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Config, logger, utils } from 'zylax';
import { trpcMiddleware } from './express/middleware/trpcMiddleware';
import authMiddleware from './express/middleware/authMiddleware';
import http from 'http';
import { Server } from 'socket.io';

export default class Webserver {
   static server: http.Server;
   static io: Server;
   static logger = logger.child({ label: 'Webserver' });

   static init() {
        const app = express();

        // Parse cookies
        app.use(cookieParser());

        // Setup static directory
        // @ts-ignore
        app.use(express.static(utils.dirs().PUBLIC));

        // Allow CORS
        app.use(cors());
        
        app.use(authMiddleware);

        // Disable 'X-Powered-By' header
        app.disable('x-powered-by');

        // Setup session middleware
        this.logger.debug('Setting up session middleware...');

        // Add tRPC middleware
        this.logger.debug('Setting up tRPC middleware...');
        app.use('/trpc', trpcMiddleware);

        // Create websocket
        this.server = http.createServer(app);
        this.io = new Server(this.server);
   }

   static start() {
        // Get webserver port
        const port = Config.get('system.server.port');

        this.logger.debug(`Starting server on port ${port}...`);
        this.server.listen(port, () => {
            this.logger.info(`Listening at http://localhost:${port}.`);
        });
   }
}