import type { Constructor } from 'hiem/@types/helpers'
import { UserController, type ModelWithProps, errors, User, ControllerRegister, UserPermissionAction, InferSchema, Model } from 'hiem';
import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { type Request as ExRequest, type Response } from 'express';

interface Request extends ExRequest {
    user: User
}

export const createContext = async ({ req, res }: { req: Request, res: Response }) => {
    const requirePermission = (resource: Model<any>, action: UserPermissionAction) => {
        if (!req.user.hasPermission(resource, action)) {
            switch(action) {
                case 'view': 
                    throw new errors.PermissionViewError(resource);
                case 'manage': 
                    throw new errors.PermissionManageError(resource);
                case 'interact': 
                    throw new errors.PermissionInteractError(resource);
                default: 
                    throw new errors.PermissionError(resource);
            }
        }

        return true;
    }

    const getResourceOrThrow = async<M extends ModelWithProps<any>>(
        model: Constructor<M>, 
        id: number | string, 
        permissionAction: UserPermissionAction | false = 'view'
    ) => {
        const controller = ControllerRegister.get(model);
        const resource = controller.find(id);

        if (!resource) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Resource [${model.name} ${id}] not found.`
            })
        }
        
        if(permissionAction !== false) {
            requirePermission(resource, permissionAction);
        }

        return resource as M;
    }

    const getDocumentOrThrow = async <M extends ModelWithProps<any>>(
        model: Constructor<M>,
        id: number | string,
        action: UserPermissionAction | false = 'view'
    ) => {
        const resource = await getResourceOrThrow(model, id, action);
        return await resource.getAllProps() as InferSchema<M>
    }

    const getCollection = async <T extends ModelWithProps<any>>(
        model: Constructor<T>
    ): Promise<T[]> => {
        const controller = ControllerRegister.get(model);
        return controller.index().filter((r: any) => req.user.hasPermission(r, 'view'));
    }

    const getIndex = async <T extends ModelWithProps<any>>(
        model: Constructor<T>,
        props: string[]
    ): Promise<Record<string, any>[]> => {
        const collection = await getCollection(model);

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
        requirePermission,
        getDocumentOrThrow,
        getResourceOrThrow,
        getCollection,
        getIndex
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
