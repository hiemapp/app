import axios, { AxiosRequestConfig } from 'axios';

export type ApiResponseData = {
  result: any;
  aggregation: any;
};

export interface FetchQueryResult<TResult> {
  result: TResult;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export default async function fetchQuery<TResult = unknown>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<FetchQueryResult<TResult>> {
  const { data } = await axios.request({
    ...config,
    url: `api/${endpoint}`,
  });

  return data;
}
