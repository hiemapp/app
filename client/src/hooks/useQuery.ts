import { useQuery as originalUseQuery, UseQueryResult as OriginalUseQueryResult } from '@tanstack/react-query';
import fetchQuery from '@/utils/fetchQuery';
import { AxiosRequestConfig } from 'axios';

export type ApiResponseData<TResult> = {
    result: TResult;
    aggregation: any;
};

export type UseQueryOptions<TResult, TAggregation> = Partial<{
    onSuccess: (result: TResult, aggregation: TAggregation) => any;
}>;

export type UseQueryResult<TResult, TAggregation> = OriginalUseQueryResult & {
    result: TResult;
    aggregation: TAggregation;
};

/** @deprecated */
export default function useQuery<TResult = unknown, TAggregation = any>(
    endpoint: string,
    options: UseQueryOptions<TResult, TAggregation> = {},
    config: AxiosRequestConfig = {},
): UseQueryResult<TResult, TAggregation> {
    const query = originalUseQuery<ApiResponseData<TResult>>({
        onSuccess: (data: ApiResponseData<TResult>) => {
            return options.onSuccess?.(data.result, data.aggregation);
        },
        queryKey: [endpoint],
        queryFn: async (): Promise<any> => {
            return fetchQuery(endpoint, config);
        },
    } as any);

    return {
        ...query,
        aggregation: query?.data?.aggregation,
        result: query?.data?.result!,
    };
}
