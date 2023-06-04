import { User, UserController, type Constructor, type GetPropsSerializedType } from 'zylax';
import { type ModelWithProps } from 'zylax';
import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { type Request as ExRequest, type Response } from 'express';

interface Request extends ExRequest {
    user?: {
        id?: number
    }
}

export const createContext = async ({ req, res }: { req: Request, res: Response }) => {
    const user = UserController.find(req.user?.id!) || UserController.findDefaultUser();

    const requirePermission = (permission: string) => {
        if(typeof permission === 'string' && !user.hasPermission(permission)) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: `Missing permission: '${permission}'.`
            })
        }

        return true;
    }

    const getResourceOrThrow = async<T extends ModelWithProps<any, any>>(model: Constructor<T>, id: number | string): Promise<T> => {
        const controller = model.prototype._getConfig().controller;
        const resource = controller.find(id);
        
        if(!resource) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `${model.name} ${id} not found.`
            })
        }

        return resource;
    }

    const getDocumentOrThrow = async <T extends ModelWithProps>(
        model: Constructor<T>, 
        id: number
    ): Promise<ReturnType<T['serialize']>> => {
        const resource = await getResourceOrThrow(model, id);
        return await resource.serialize() as ReturnType<T['serialize']>;
    }

    const getCollection = async <T extends ModelWithProps<any, any>>(
        model: Constructor<T>, 
        hasPermission?: (document: T) => boolean
    ): Promise<T[]> => {
        const controller = model.prototype._getConfig().controller;
        let collection = controller.index();

        if(typeof hasPermission === 'function') {
            collection = collection.filter(hasPermission);
        }  

        return collection;
    }

    const getIndex = async <T extends ModelWithProps<any, any>>(
        model: Constructor<T>,
        props: string[], 
        hasPermission?: (document: T) => boolean
    ): Promise<Record<string, any>[]> => {
        const collection = await getCollection(model, hasPermission);

        return collection.map(m => {
            const data: Record<string, any> = { id: m.getId() };

            props.forEach(name => {
                data[name] = m.getProp(name);
            })

            return data;
        });
    }


    return {
        user,
        req,
        res,
        requirePermission,
        getDocumentOrThrow,
        getResourceOrThrow,
        getCollection,
        getIndex
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
