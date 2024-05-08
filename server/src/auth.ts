import { Config, Database, User, UserController } from 'zylax';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { parse as parseCookie } from 'cookie';

export const AUTH_COOKIE_NAME = 'zylax_authtoken';

export const authenticate = async (username: any, password: any) => {
    return new Promise<User>(async (resolve, reject) => {
        if(typeof username !== 'string' || !username) return reject('usernameEmpty');
        if(typeof password !== 'string' || !password) return reject('passwordEmpty');

        const user = UserController.findBy('username', username);

        if(user) {
            const promise = user.verifyPasswordTimeSafe(password).catch(err => reject(err));
            
            if(await promise === true) {
                return resolve(user);
            }
        }

        return reject('incorrectUsernameOrPassword');
    })
}

export const getUserFromCookies = (cookies: Record<string, string>) => {
    let user = UserController.findDefaultUser();
    const token = cookies[AUTH_COOKIE_NAME];

    if(typeof token === 'string') {
        const payload: any = jwt.verify(token, Config.get('secret.jwtSecret'));

        if(payload && typeof payload.userId === 'number') {
            user = UserController.find(payload.userId);
        }
    }

    return user;
}


export const generateToken = (user: User) => {
    if(!(user instanceof User)) {
        throw new Error('Invalid user.');
    }

    const jwtSecret = Config.get('secret.jwtSecret');
    const token = jwt.sign({ userId: user.id }, jwtSecret);

    return token;
}