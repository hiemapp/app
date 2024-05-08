export function parseFieldValue(value: any, type: string): any {
    if (type === 'number') return parseFloat(value);
    if (type === 'boolean') return !!value;
    return value + '';
}

export function getShadowBlock(paramType: string, defaultValue?: any): Record<string, any>|undefined {
    return {
        'boolean': {
            type: '@hiem/core.logic_boolean',
            fields: {
                VALUE: defaultValue ?? true
            },
        },
        'string': {
            type: '@hiem/core.text_string',
            fields: {
                VALUE: defaultValue ?? 'Hello world!'
            },
        },
        'any':
        {
            type: '@hiem/core.text_string',
            fields: {
                VALUE: defaultValue ?? 'Hello world!'
            },
        },
        'number':
        {
            type: '@hiem/core.math_number',
            fields: {
                VALUE: defaultValue ?? 3
            },
        },
        'time': { 
            type: '@hiem/core.datetime_time' 
        },
        'date':{
            type: '@hiem/core.datetime_date'
        },
        'color': {
            type: '@hiem/core.utils_color'
        }
    }[paramType];
}