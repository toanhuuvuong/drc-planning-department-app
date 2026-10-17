import { useKhotpMasterLoaiSpControllerFind } from 'main/apis/drc/endpoints/khotp-master-loai-sp-controller/khotp-master-loai-sp-controller';
import { useMemo } from 'react';

function useProductTypeOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productTypes, isLoading: productTypesIsLoading } = useKhotpMasterLoaiSpControllerFind();

  // React Function
  const productTypeOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productTypes) {
      options.push(...productTypes.map((productType) => ({ id: productType.maLoai, text: productType.tenLoai })));
    }

    return options;
  }, [includeAllOption, productTypes]);

  return { productTypeOptions, productTypesIsLoading };
}

export default useProductTypeOptions;
