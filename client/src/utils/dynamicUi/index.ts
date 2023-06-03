import { SerializedElement } from 'zylax';
import * as components from './components'
import { forOwn } from 'lodash';
import { createElement } from 'react';

export type EventHandler = (listenerId: string) => unknown;

export function getElementType(tag: string): string {
    const firstLetter = tag.substring(0, 1);
    const isComponent = (firstLetter === firstLetter.toUpperCase());

    if (isComponent) {
        return (components as any)[tag];
    } else {
        return tag.toLowerCase();
    }
}

export function renderElement(element: SerializedElement, eventHandler: EventHandler): string | null | React.ReactNode {
    if (typeof element.tag !== 'string') {
        if(typeof element.text === 'string') {
            return element.text;
        }

        return null
    }
    
    const ElementType = getElementType(element.tag);
    if (!ElementType) {
        console.warn(`Can not find widget element '${element.tag}'.`);
        return null;
    }
    
    const props = element.props ?? {};
    if (element.listeners) {
        forOwn(element.listeners, (listener, event) => {
            if(typeof listener.id === 'string') {
                // Add the event handler to the props
                (props as any)[event] = () => eventHandler(listener.id);
            }  
        })
    }

    const renderedChildren = (element?.children ?? []).map(child => renderElement(child, eventHandler));

    return createElement(ElementType, props, ...renderedChildren);
}