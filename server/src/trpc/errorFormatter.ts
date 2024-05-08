import { Notification, errors } from 'hiem';

const errorFormatter = (opts: any) => {
    let { shape, error, ctx } = opts;
    
    let customError: errors.CustomError|null = null;
    if(error instanceof errors.CustomError) {
        customError = error;
    } else if(error.cause instanceof errors.CustomError) {
        customError = error.cause;
    }
    
    if(customError) {
        const notification = Notification.fromError(customError);
        notification.sendTo(ctx.req.socket);

        return {
            ...shape,
            message: customError.message,
            data: shape.data
        }
    }

    return shape;
}

export default errorFormatter;