import { router, publicProcedure } from '../trpc';
import { FlowBlock, FlowBlockCategory, logger, Extension, ExtensionController, Flow, BlocklyTranspiler, FlowBlockParameterContext } from 'hiem';
import _ from 'lodash';
import { z } from 'zod';

export const flowEditorRouter = router({
    listBlocks: publicProcedure
        .query(({ ctx }) => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: any[] = [];

            flowBlocks.forEach(extModule => {
                try {
                    result.push({
                        type: extModule.$module.id,
                        manifest: extModule.getManifest().toJSON(),
                        layout: extModule.$module.methods.getLayout().serialize(),
                    });
                } catch (err: any) {
                    logger.error(err);
                    return true;
                }
            });

            return result;
        }),

    getDynamicParamLayout: publicProcedure
        .input(z.object({
            flowId: z.number(),
            blockId: z.string(),
            blockType: z.string(),
            paramId: z.string(),
            values: z.record(z.string(), z.any())
        }))
        .query(({ ctx, input }) => {
            const flowBlock = ExtensionController.findModule(FlowBlock, input.blockType);

            const blockLayout = flowBlock.$module.methods.getLayout();
            const paramLayout = blockLayout.getParameterOrFail(input.paramId);
            if(typeof paramLayout?.provider?.handler !== 'function') return null;

            // Format the `input.values` to match the expected types
            const formattedValues: Record<string, any> = {};
            blockLayout.getParameters().forEach(param => {
                formattedValues[param.id] = FlowBlockParameterContext.formatValue(input.values[param.id], param);
            })

            const dynamicLayout = paramLayout.provider.handler(formattedValues);
            const serializedLayout = FlowBlock.serializeParameterLayout({ ...paramLayout, ...dynamicLayout });
            return serializedLayout;
        }),

    listBlockCategories: publicProcedure
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