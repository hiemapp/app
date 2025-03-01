import { logger, UserController, ExtensionController, ConnectorController, DeviceController, FlowController, ScriptController, LanguageController, TaskController } from 'hiem';

export async function boot() {
    logger.debug('Booting controllers...');
    await TaskController.load();
    await UserController.load();
    await ExtensionController.load();
    await ConnectorController.load();
    await DeviceController.load();
    await FlowController.load();
    await ScriptController.load();
    LanguageController.load();
}