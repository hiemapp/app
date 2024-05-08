import appState from '@/utils/appState';
import { useEffect, useState } from 'react';

const useappState = <TValue>(key: string, fallback?: (value: any) => TValue): [ TValue, (newValue: TValue) => void ] => {
    const [ state, setState ] = useState<TValue>(appState.getStorage(key, fallback));

    const setValue = (value: TValue) => {
        appState.setStorage(key, value);
        setState(value);
    }

    return [
        state,
        setValue
    ]
}

export default useappState;