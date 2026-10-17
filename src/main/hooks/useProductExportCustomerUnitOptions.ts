import { useKhotpMasterDonViControllerFind } from 'main/apis/drc/endpoints/khotp-master-don-vi-controller/khotp-master-don-vi-controller';
import { useKhotpMasterKhachHangControllerFind } from 'main/apis/drc/endpoints/khotp-master-khach-hang-controller/khotp-master-khach-hang-controller';
import { useMemo } from 'react';

function useProductExportCustomerUnitOptions(includeAllOption?: boolean) {
  // React Query
  const { data: productExportCustomer, isLoading: productExportCustomerIsLoading } =
    useKhotpMasterKhachHangControllerFind();
  const { data: productOrigins, isLoading: productOriginsIsLoading } = useKhotpMasterDonViControllerFind();

  // React Function
  const productExportCustomersUnitOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productExportCustomer) {
      options.push(
        ...productExportCustomer.map((productStore) => ({ id: productStore.maKh, text: productStore.tenKh })),
      );
    }

    if (productOrigins) {
      options.push(
        ...productOrigins.map((productOrigin) => ({ id: productOrigin.maDonVi, text: productOrigin.tenDonVi })),
      );
    }

    return options;
  }, [includeAllOption, productExportCustomer, productOrigins]);

  return {
    productExportCustomersUnitOptions,
    productExportCustomer,
    suppliesUnitsAndOriginsIsLoading: productExportCustomerIsLoading || productOriginsIsLoading,
  };
}

export default useProductExportCustomerUnitOptions;
