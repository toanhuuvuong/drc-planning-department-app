import { drcAxios } from 'main/configs/axios';
import { ExtractFnReturnType, QueryConfig } from 'main/configs/react-query';
import { ApiUrl } from 'main/constants';
import { SuppliesCategory } from 'main/types';
import { useQuery } from 'react-query';

type GetSuppliesCategoriesResponse = {
  content: SuppliesCategory[];
};

export async function getSuppliesCategories(): Promise<SuppliesCategory[]> {
  return drcAxios.get(ApiUrl.DRC.GET_SUPPLIES_CATEGORIES).then((response) => {
    const data = response.data as GetSuppliesCategoriesResponse;
    return data.content;
  });
}

type QueryFnType = typeof getSuppliesCategories;

type QueryOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useGetSuppliesCategories(queryOptions?: QueryOptions) {
  const config = queryOptions?.config || {};

  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['suppliesCategories'],
    queryFn: getSuppliesCategories,
  });
}
