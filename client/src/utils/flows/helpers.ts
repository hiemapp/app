export function parseFieldValue(value: any, type: string): any {
    if (type === 'number') return parseFloat(value);
    if (type === 'boolean') return !!value;
    return value + '';
}
