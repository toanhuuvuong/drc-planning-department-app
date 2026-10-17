import { useKhotpMasterDonViControllerFind } from 'main/apis/drc/endpoints/khotp-master-don-vi-controller/khotp-master-don-vi-controller';
import { useMemo } from 'react';

function useProductOriginOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productOrigins, isLoading: productOriginsIsLoading } = useKhotpMasterDonViControllerFind();

  // React Function
  const productOriginOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productOrigins) {
      options.push(
        ...productOrigins.map((productOrigin) => ({ id: productOrigin.maDonVi, text: productOrigin.tenDonVi })),
      );
    }

    return options;
  }, [includeAllOption, productOrigins]);

  return { productOriginOptions, productOriginsIsLoading };
}

export default useProductOriginOptions;
