import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { randomBytes } from 'crypto';
import { logger, Config, User, UserController } from 'zylax';

export default class passportService {
    private sessionSecret: string;

    static getOrCreateSecret() {
        const newSecret = randomBytes(32).toString('base64');
        return Config.getOrCreate('secret.webSessionSecret', newSecret);
    }

    static init() {
        passport.use(
            new LocalStrategy(async (username: string, password: string, cb) => {
                const user = await UserController.findBy('username', username);

                try {
                    if (user && (await user.verifyPasswordTimeSafe(password))) {
                        return cb(null, user);
                    }
                } catch (err: any) {
                    logger.error(err);
                    return cb(null, false, { message: 'Something went wrong. See log for details.' });
                }

                return cb(null, false, { message: 'Incorrect username or password.' });
            }),
        );
        
        passport.serializeUser((_user: any, cb) => {
            const user: User = _user;
            cb(null, { id: user.getId() });
        });

        // Deserializing the user is handled by tRPC context,
        // so just return the data as is.
        passport.deserializeUser((data: any, cb) => cb(null, data));
    }
}
