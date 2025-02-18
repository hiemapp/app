import get from 'lodash/get';
import { InferSchema, Device } from 'hiem';

export function hasTrait(traits: InferSchema<Device>['traits'], predicate: (trait: InferSchema<Device>['traits'][number]) => any) {
    return traits.some(predicate);
}

export function findTraitOption(traits: InferSchema<Device>['traits'], keypath: string) {
    let value: any = undefined;
    for(const trait of traits) {
        value = get(trait.options, keypath);
        if(typeof value !== 'undefined') break;
    }
    
    if(typeof value === 'undefined') return null;
    return value;
}