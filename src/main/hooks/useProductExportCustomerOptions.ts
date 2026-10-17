import { useKhotpMasterKhachHangControllerFind } from 'main/apis/drc/endpoints/khotp-master-khach-hang-controller/khotp-master-khach-hang-controller';
import { useMemo } from 'react';

function useProductExportCustomerOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productExportCustomer, isLoading: productExportCustomerIsLoading } =
    useKhotpMasterKhachHangControllerFind();

  // React Function
  const productExportCustomers = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productExportCustomer) {
      options.push(
        ...productExportCustomer.map((productStore) => ({ id: productStore.maKh, text: productStore.tenKh })),
      );
    }

    return options;
  }, [includeAllOption, productExportCustomer]);

  return { productExportCustomers, productExportCustomerIsLoading };
}

export default useProductExportCustomerOptions;
