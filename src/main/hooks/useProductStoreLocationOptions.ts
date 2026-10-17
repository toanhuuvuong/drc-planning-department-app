import { useKhotpMasterViTriKhoControllerFind } from 'main/apis/drc/endpoints/khotp-master-vi-tri-kho-controller/khotp-master-vi-tri-kho-controller';
import { useMemo } from 'react';

function useProductStoreLocationOptions(
  includeAllOption?: boolean,
  productStoreCode?: string | null,
  productStoreCodeError?: string | null,
) {
  // React Query
  const { data: productStoreLocations, isLoading: productStoreLocationsIsLoading } =
    useKhotpMasterViTriKhoControllerFind();

  // React Function
  const productStoreLocationOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productStoreLocations) {
      options.push(
        ...productStoreLocations
          .filter((productStoreLocation) => {
            if (productStoreCode && !productStoreCodeError) {
              return productStoreLocation.khoAndViTris?.some((khoAndViTri) => khoAndViTri.maKho === productStoreCode);
            }
            return true;
          })
          .map((productStoreLocation) => ({
            id: productStoreLocation.maViTriKho,
            text: productStoreLocation.tenViTriKho,
          })),
      );
    }

    return options;
  }, [includeAllOption, productStoreCode, productStoreCodeError, productStoreLocations]);

  return { productStoreLocationOptions, productStoreLocationsIsLoading };
}

export default useProductStoreLocationOptions;
