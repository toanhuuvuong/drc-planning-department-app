import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { drcAxios } from 'main/configs/axios';

export const AXIOS_INSTANCE = drcAxios;

export const drcInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by Vue Query');
  };

  return promise;
};

export default drcInstance;

export interface ErrorType<Error> extends AxiosError<Error> {}
