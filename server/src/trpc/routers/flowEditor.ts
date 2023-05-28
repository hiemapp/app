import { router, publicProcedure } from '../trpc';
import { FlowBlock, FlowBlockCategory, logger, Extension, ExtensionController } from 'zylax';
import { type FlowBlockManifest } from '../../../../shared/types/flows/FlowBlock';
import _ from 'lodash';

export const flowEditorRouter = router({
    listBlocks: publicProcedure
        .query(({ ctx }) => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: Array<{ type: string; manifest: FlowBlockManifest }> = [];

            _.forOwn(flowBlocks, (moduleClass, moduleSlug) => {
                try {
                    result.push({
                        type: moduleSlug,
                        manifest: moduleClass.prototype.getManifest(),
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
                        manifest: moduleClass.prototype.getManifest(),
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