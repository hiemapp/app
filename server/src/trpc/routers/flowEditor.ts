import { router, publicProcedure } from '../trpc';
import { FlowBlock, FlowBlockCategory, logger, Extension, ExtensionController } from 'zylax';
import _ from 'lodash';

export const flowEditorRouter = router({
    listBlocks: publicProcedure
        .query(({ ctx }) => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: any[] = [];

            _.forOwn(flowBlocks, (moduleClass, moduleSlug) => {
                try {
                    result.push({
                        type: moduleSlug,
                        manifest: moduleClass.manifest.toJSON(),
                        layout: moduleClass.layout(),
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

            _.forOwn(flowBlockCategories, (moduleClass, moduleSlug) => {
                const [ extensionId, moduleName ] = Extension.parseModuleSlug(moduleSlug);
                
                try {
                    result.push({
                        id: moduleName,
                        manifest: moduleClass.manifest.toJSON(),
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