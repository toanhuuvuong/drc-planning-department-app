import { useKhotpMasterKhoControllerFind } from 'main/apis/drc/endpoints/khotp-master-kho-controller/khotp-master-kho-controller';
import { useKhotpMasterSanPhamControllerFind } from 'main/apis/drc/endpoints/khotp-master-san-pham-controller/khotp-master-san-pham-controller';
import { useMemo } from 'react';

function useProductOrderAutoCompleteOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productData, isLoading: IsLoadingProductData } = useKhotpMasterSanPhamControllerFind();
  const { data: productStores, isLoading: productStoresIsLoading } = useKhotpMasterKhoControllerFind();

  // React Function
  const productDataOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productData) {
      options.push(
        ...productData.map((productStore) => ({
          ...productStore,
          id: productStore.maSanPham,
          text: productStore.tenSanPham || '',
        })),
      );
    }

    return options;
  }, [includeAllOption, productData]);

  const productStoreOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productStores) {
      options.push(
        ...productStores.map((productStore) => ({
          ...productStore,
          id: productStore.maKho,
          text: productStore.tenKho,
        })),
      );
    }

    return options;
  }, [includeAllOption, productStores]);

  return { productDataOptions, IsLoadingProductData, productStoreOptions, productStoresIsLoading };
}

export default useProductOrderAutoCompleteOptions;
