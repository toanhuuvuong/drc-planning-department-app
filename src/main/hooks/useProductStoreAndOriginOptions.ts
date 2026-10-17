import { useKhotpMasterDonViControllerFind } from 'main/apis/drc/endpoints/khotp-master-don-vi-controller/khotp-master-don-vi-controller';
import { useKhotpMasterKhoControllerFind } from 'main/apis/drc/endpoints/khotp-master-kho-controller/khotp-master-kho-controller';
import { useMemo } from 'react';

function useProductStoreAndOriginOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productStores, isLoading: productStoresIsLoading } = useKhotpMasterKhoControllerFind();
  const { data: productOrigins, isLoading: productOriginsIsLoading } = useKhotpMasterDonViControllerFind();

  // React Function
  const productStoreAndOriginOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productStores) {
      options.push(...productStores.map((productStore) => ({ id: productStore.maKho, text: productStore.tenKho })));
    }

    if (productOrigins) {
      options.push(
        ...productOrigins.map((productOrigin) => ({ id: productOrigin.maDonVi, text: productOrigin.tenDonVi })),
      );
    }

    return options;
  }, [includeAllOption, productOrigins, productStores]);

  return {
    productStoreAndOriginOptions,
    productStoresAndOriginsIsLoading: productOriginsIsLoading || productStoresIsLoading,
  };
}

export default useProductStoreAndOriginOptions;
