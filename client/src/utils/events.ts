export function getPointer(e: any): { pageX: number, pageY: number } {
    if(typeof e?.pageX === 'number' && typeof e?.pageY === 'number') {
        return e;
    }

    if(e?.touches?.length > 0) {
        return e.touches[0];
    }

    throw new Error('Invalid event.');
}