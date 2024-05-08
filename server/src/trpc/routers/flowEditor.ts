import { router, publicProcedure } from '../trpc';
import { FlowBlock, FlowBlockCategory, logger, Extension, ExtensionController } from 'zylax';
import _ from 'lodash';

export const flowEditorRouter = router({
    listBlocks: publicProcedure
        .query(({ ctx }) => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: any[] = [];

            _.forOwn(flowBlocks, (moduleClass, moduleId) => {
                try {
                    result.push({
                        type: moduleId,
                        manifest: moduleClass.getManifest().toJSON(),
                        layout: moduleClass.getLayout().toJSON(),
                    });
                } catch (err: any) {
                    logger.error(err);
                    return true;
                }
            });

            return result;
        }),

    listBlockCategories: publicProcedure
        .query(({ ctx }): Array<any> => {
            const flowBlockCategories = ExtensionController.findAllModulesOfType(FlowBlockCategory);
            const result: any[] = [];

            _.forOwn(flowBlockCategories, (moduleClass, moduleId) => {
                const [ extensionId, moduleName ] = Extension.parseModuleId(moduleId);
                
                try {
                    result.push({
                        id: moduleName,
                        manifest: moduleClass.getManifest().toJSON(),
                        extensionId: extensionId,
                    });
                } catch (err: any) {
                    logger.error(err);
                    return true;
                }
            });

            return result;
        })
})