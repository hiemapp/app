import WebServer from '@/WebServer';
import { Config, DeviceController, logger, NotificationEmitter, User } from 'hiem';
import crypto from 'crypto';
import userMiddleware from '@/websocket/middleware/userMiddleware';
import { Socket } from 'socket.io';

export async function boot() {
    if (typeof Config.getOrFail('secret.jwtSecret') !== 'string') {
        logger.debug('Generating new JWT secret...');
        Config.update('secret.jwtSecret', crypto.randomBytes(256).toString('base64'));
    }

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
                if (recipient instanceof User && socket.data.user.id !== recipient.id) return;
                if (recipient instanceof Socket && socket.id === recipient.id) return;

                socket.emit('notification', props);
            })
        })
    })

    // Add websocket listeners for device events
    DeviceController.index().forEach(device => {
        ['state:update', 'connection:update'].forEach((event: any) => {
            device.on(event, async () => {
                const sockets = await WebServer.io.fetchSockets();
                sockets.map(socket => {
                    const user = socket.data.user;

                    WebServer.io.sockets.emit('device:update', {
                        device: {
                            id: device.id,
                            state: device.getState(),
                            display: device.getDisplay(user)
                        }
                    });
                })

            })
        })
    })

    // Start the webserver
    WebServer.start();
}