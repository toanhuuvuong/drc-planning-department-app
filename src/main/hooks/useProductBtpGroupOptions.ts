import { useKhotpMasterNhomBtpControllerFind } from 'main/apis/drc/endpoints/khotp-master-nhom-btp-controller/khotp-master-nhom-btp-controller';
import { useMemo } from 'react';

function useProductBtpGroupOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productGroups, isLoading: productGroupsIsLoading } = useKhotpMasterNhomBtpControllerFind();

  // React Function
  const productGroupOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productGroups) {
      options.push(
        ...productGroups.map((productGroup) => ({
          id: productGroup.maNhom,
          text: productGroup?.maNhom + ' - ' + productGroup?.tenNhom,
        })),
      );
    }

    return options;
  }, [includeAllOption, productGroups]);

  return { productGroupOptions, productGroupsIsLoading };
}

export default useProductBtpGroupOptions;
