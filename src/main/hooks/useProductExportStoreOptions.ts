import { useKhotpMasterSanPhamControllerFind } from 'main/apis/drc/endpoints/khotp-master-san-pham-controller/khotp-master-san-pham-controller';
import { useMemo } from 'react';

function useProductExportStoreOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productStores, isLoading: IsLoadingProductStores } = useKhotpMasterSanPhamControllerFind();

  // React Function
  const productStoreOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productStores) {
      options.push(
        ...productStores.map((productStore) => ({
          id: productStore.maSanPham,
          text: productStore?.maSanPham + '-' + productStore?.tenSanPham,
          // text: productStore.tenSanPham || '',
        })),
      );
    }

    return options;
  }, [includeAllOption, productStores]);

  return { productStoreOptions, IsLoadingProductStores };
}

export default useProductExportStoreOptions;
