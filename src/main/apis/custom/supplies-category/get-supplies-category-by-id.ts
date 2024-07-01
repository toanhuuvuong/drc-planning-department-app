import { useQuery } from '@tanstack/react-query';
import { drcAxios } from 'main/configs/axios';
import { ExtractFnReturnType, QueryConfig } from 'main/configs/react-query';
import { ApiUrl } from 'main/constants';
import { SuppliesCategory } from 'main/types';

type GetSuppliesCategoryByIdResponse = {
  content: SuppliesCategory;
};

export type GetSuppliesCategoryByIdParams = {
  suppliesCategoryId: string;
};

export async function getSuppliesCategoryById({
  suppliesCategoryId,
}: GetSuppliesCategoryByIdParams): Promise<SuppliesCategory> {
  return drcAxios
    .get(ApiUrl.DRC.GET_SUPPLIES_CATEGORY_BY_ID, {
      params: { suppliesCategoryId },
    })
    .then((response) => {
      const data = response.data as GetSuppliesCategoryByIdResponse;
      return data.content;
    });
}

type QueryFnType = typeof getSuppliesCategoryById;

type QueryOptions = {
  params: GetSuppliesCategoryByIdParams;
  config?: QueryConfig<QueryFnType>;
};

export function useGetSuppliesCategoryById({ params, config = {} }: QueryOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['suppliesCategory', ...Object.values(params)],
    queryFn: () => getSuppliesCategoryById(params),
  });
}
