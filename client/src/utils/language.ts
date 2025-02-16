/**
 * Generate a message id from an extension module slug.
 * @param moduleSlug The slug of the module.
 * @param moduleTypePath The type path of the module.
 * @param messagePath The message path to find.
 * @returns The message id.
 * 
 * @example
 * getMessageId('@hiem/core.my_driver', 'devices.drivers', 'recording.fields.myField.label')
 */
export function getMessageId(moduleSlug: string, moduleTypePath: string, messagePath: string) {
    const [extensionId, moduleId] = moduleSlug.split('.');
    return `${extensionId}.${moduleTypePath}.${moduleId}.${messagePath}`;
}