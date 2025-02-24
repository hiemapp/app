import { router, publicProcedure } from '../trpc';
import { FlowBlock, FlowBlockCategory, logger, Extension, ExtensionController, Flow, BlocklyTranspiler, FlowBlockParameterContext } from 'hiem';
import _ from 'lodash';

export const flowWorkspaceRouter = router({
    listBlocks: publicProcedure
        .query(({ ctx }) => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: any[] = [];

            flowBlocks.forEach(extModule => {
                try {
                    result.push({
                        type: extModule.$module.id,
                        manifest: extModule.getManifest().toJSON(),
                        layout: extModule.$module.methods.getLayout().toJSON(),
                    });
                } catch (err: any) {
                    logger.error(err);
                    return true;
                }
            });

            return result;
        }),

    listCategories: publicProcedure
        .query(({ ctx }): Array<any> => {
            const flowBlockCategories = ExtensionController.findAllModulesOfType(FlowBlockCategory);
            const result: any[] = [];

            flowBlockCategories.forEach(extModule => {
                const [ extensionId, moduleName ] = Extension.parseModuleId(extModule.$module.id);
                
                try {
                    result.push({
                        id: moduleName,
                        manifest: extModule.getManifest().toJSON(),
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