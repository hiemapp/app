import { useMemo, useRef } from 'react';

function useNullableMemo<T>(factory: () => T, deps: React.DependencyList) {
  // Use a ref to store the previous value
  const validValueRef = useRef<T|null>(null);

  return useMemo<T|null>(() => {
    const newValue = factory();

    // If the factory returns a non-null value, update the ref
    if (newValue !== null) {
      validValueRef.current = newValue;
    }

    // Return the current or previous value
    return validValueRef.current;
  }, deps);
}

export default useNullableMemo;