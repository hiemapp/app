import type { Constructor } from 'hiem/@types/helpers'
import { UserController, type ModelWithProps } from 'hiem';
import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { type Request as ExRequest, type Response } from 'express';
import type { User } from 'hiem';

interface Request extends ExRequest {
    user: User
}

export type SerializedPropsOf<M extends ModelWithProps<any>> = M extends ModelWithProps<infer T> ? T['serializedProps'] : never;
export type PropsOf<M extends ModelWithProps<any>> = M extends ModelWithProps<infer T> ? T['props'] : never;

export const createContext = async ({ req, res }: { req: Request, res: Response }) => {
    const requirePermissionKey = (key: string) => {
        if(typeof key === 'string' && !req.user.hasPermission(key)) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: `Missing permission: '${key}'.`
            })
        }

        return true;
    }

    const getResourceOrThrow = async<M extends ModelWithProps<any>>(model: Constructor<M>, id: number | string) => {
        const controller = model.prototype.__modelConfig().controller;
        const resource = controller.find(id);
        
        if(!resource) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Resource [${model.name} ${id}] not found.`
            })
        }

        return resource as M;
    }

    const getDocumentOrThrow = async <M extends ModelWithProps<any>>(
        model: Constructor<M>, 
        id: number | string
    ) => {
        const resource = await getResourceOrThrow(model, id);
        return await resource.getAllProps() as SerializedPropsOf<M>;
    }

    const getCollection = async <T extends ModelWithProps<any>>(
        model: Constructor<T>, 
        hasPermission?: (document: T) => boolean
    ): Promise<T[]> => {
        const controller = model.prototype.__modelConfig().controller;
        let collection = controller.index();

        if(typeof hasPermission === 'function') {
            collection = collection.filter(hasPermission);
        }  

        return collection;
    }

    const getIndex = async <T extends ModelWithProps<any>>(
        model: Constructor<T>,
        props: string[], 
        hasPermission?: (document: T) => boolean
    ): Promise<Record<string, any>[]> => {
        const collection = await getCollection(model, hasPermission);

        return collection.map(m => {
            const data: Record<string, any> = { id: m.id };

            props.forEach(name => {
                data[name] = m.getProp(name);
            })

            return data;
        });
    }

    req.user = req.user ?? UserController.findDefaultUser();

    return {
        req,
        res,
        requirePermissionKey,
        getDocumentOrThrow,
        getResourceOrThrow,
        getCollection,
        getIndex
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
