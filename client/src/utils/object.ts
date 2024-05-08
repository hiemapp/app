import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';
import merge from 'lodash/merge';

// Convert {a: {b: 'value'}} to {'a.b': 'value'}
export function flattenKeys(obj: Object, seperator = '.', path: string[] = []): Record<string, any> {
    return !isObject(obj)
        ? { [path.join(seperator)]: obj }
        : reduce(obj, (cum, next, key) => merge(cum, flattenKeys(next, seperator, [...path, key])), {});
}