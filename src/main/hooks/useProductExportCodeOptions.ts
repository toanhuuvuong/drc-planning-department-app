import { useKhotpMasterNhomSpControllerFind } from 'main/apis/drc/endpoints/khotp-master-nhom-sp-controller/khotp-master-nhom-sp-controller';
import { useMemo } from 'react';

function useProductGroupOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productGroups, isLoading: productGroupsIsLoading } = useKhotpMasterNhomSpControllerFind();

  // React Function
  const productGroupOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productGroups) {
      options.push(...productGroups.map((productGroup) => ({ id: productGroup.maNhom, text: productGroup.tenNhom })));
    }

    return options;
  }, [includeAllOption, productGroups]);

  return { productGroupOptions, productGroupsIsLoading };
}

export default useProductGroupOptions;
