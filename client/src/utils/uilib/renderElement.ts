import { createElement, Fragment } from 'react';
import { SerializedNode } from 'zylax/dist/ui/jsx/types';
import _ from 'lodash';
import * as components from '../uilib/components'
export type EventHandler = (callbackId: number, childIndex: number, args: any[]) => unknown;

function getElementType(tag: string): string {
    const firstLetter = tag.substring(0, 1);
    const isComponent = (firstLetter === firstLetter.toUpperCase());

    if (isComponent) {
        return (components as any)[tag];
    } else {
        return tag.toLowerCase();
    }
}

export function renderElement(element: SerializedNode | SerializedNode[], eventHandler: EventHandler): any {
    if(Array.isArray(element)) return element.map(el => renderElement(el, eventHandler));
    if(typeof element !== 'object' || typeof element?.t !== 'string') return element;

    const tag = element.t;    
    const ElementType = getElementType(tag);
    if (!ElementType) {
        console.warn(`Component '${tag}' not found.`);
        return null;
    }

    let props: Record<string, any> = {};
    if(element.p && typeof element.p === 'object') {
        props = _.mapValues(element.p, value => {
            if(value && value._ && typeof value._ === 'object') {
                if(typeof value._.cId === 'number' && typeof value._.cIx === 'number') {
                    return (...args: any[]) => {
                        eventHandler(value._.cId, value._.cIx, args);
                    }
                }
            }

            return renderElement(value, eventHandler);
        })
    }
    
    let children: React.ReactNode[] = [];
    if(props.children) {
        children = props.children;
        delete props.children;
    }
    
    return createElement(ElementType, props, ...children);
}