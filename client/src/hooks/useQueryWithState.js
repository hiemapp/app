import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const useQueryWithState = (options, config = {}) => {
    const [ data, setData ] = useState(null);
    config.onSuccess = data => {
        setData(data);
        config.onSucces?.apply(null, [ data ]);
    };
    const query = useQuery(options, config);

    return { ...query, data, setData };
}

export default useQueryWithState;