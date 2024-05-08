import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Config, utils, Logger } from 'hiem';
import { trpcMiddleware } from './express/middleware/trpcMiddleware';
import authMiddleware from './express/middleware/authMiddleware';
import { Server } from 'socket.io';
import http from 'http';

export default class WebServer {
     static app: Express;
     static logger: Logger;
     static server: http.Server;
     static io: Server;

     static init(ssl = true) {
          this.app = express()
          this.logger = new Logger({ label: this.name });
          
          // Parse cookies
          this.app.use(cookieParser());

          // Setup static directory
          // @ts-ignore
          this.app.use(express.static(utils.dirs().PUBLIC));

          // Allow CORS
          this.app.use(cors());

          this.app.use(authMiddleware);

          // Disable 'X-Powered-By' header
          this.app.disable('x-powered-by');

          // Route that returns basic information about the server
          this.app.get('/api/metadata', (req, res) => {
               res.json({
                    home: Config.get('home')
               })
          });

          // Add tRPC middleware
          this.app.use('/trpc', trpcMiddleware);

          // Create websocket
          this.server = http.createServer(this.app);
          this.io = new Server(this.server, {
               cors: {
                    origin: '*'
               }
          });
     }

     static start() {
          // Get webserver port
          const port = Config.get('system.server.port');

          this.server.listen(port, () => {
               this.logger.info(`Listening at http://localhost:${port}.`);
          });
     }
}