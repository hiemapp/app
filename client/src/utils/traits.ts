import get from 'lodash/get';
import { DevicePropsSerialized } from 'hiem';

export function hasTrait(traits: DevicePropsSerialized['traits'], predicate: (trait: DevicePropsSerialized['traits'][number]) => any) {
    return traits.some(predicate);
}

export function findTraitOption(traits: DevicePropsSerialized['traits'], keypath: string) {
    let value: any = undefined;
    for(const trait of traits) {
        value = get(trait.options, keypath);
        if(typeof value !== 'undefined') break;
    }
    
    if(typeof value === 'undefined') return null;
    return value;
}