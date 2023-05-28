import randomstring from 'randomstring';
import { useRef } from 'react';

function useComponentId(prefix?: string): string {
    const ref = useRef(randomstring.generate(12));
    return (prefix ? prefix+'-' : '') + ref.current;
}

export default useComponentId;