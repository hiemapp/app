import { Config, User, UserController, errors } from 'hiem';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const authenticate = async (username: any, password: any) => {
    return new Promise<User>(async (resolve, reject) => {
        try {
            if(typeof username !== 'string' || !username) {
                throw new errors.AuthEmptyUsernameError();
            }

            if(typeof password !== 'string' || !password) {
                throw new errors.AuthEmptyPasswordError();
            }

            const user = UserController.findBy('username', username);

            if(user) {
                const promise = user.verifyPasswordTimeSafe(password).catch(err => reject(err));
                
                if(await promise === true) {
                    return resolve(user);
                }
            }

            throw new errors.AuthIncorrectCredentialsError();
        } catch(err: any) {
            reject(err);
        }
    })
}

export const getUserFromToken = (token: any) => {
    let user = UserController.findDefaultUser();

    try {
        if(typeof token === 'string') {
            const payload: any = jwt.verify(token, Config.get('secret.jwtSecret'));

            if(payload && typeof payload.userId === 'number') {
                user = UserController.find(payload.userId);
            }
        }
    } catch(err) {}

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