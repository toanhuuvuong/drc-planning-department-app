import { useKhovtMasterVtControllerFind } from 'main/apis/drc/endpoints/khovt-master-vt-controller/khovt-master-vt-controller';
import { KhovtMasterVt } from 'main/apis/drc/models';
import { useCallback, useMemo } from 'react';

export type SuppliesFilter = {
  id: string | number;
  text: string;
  tenVt?: KhovtMasterVt['tenVt'];
  tenGoiNho?: KhovtMasterVt['tenGoiNho'];
  maVt?: KhovtMasterVt['maVt'];
  dvt?: KhovtMasterVt['dvt'];
  maNhom?: KhovtMasterVt['maNhom'];
  thoiHanLuuKho?: number | null;
  ghiChu?: string;
};

export type SuppliesFilterOptions = SuppliesFilter[];

function useSuppliesOptions(includeAllOption?: boolean) {
  // React Query
  const { data: suppliesStores, isLoading: suppliesIsLoading } = useKhovtMasterVtControllerFind();

  // React Function
  const suppliesOptions = useMemo(() => {
    const options: SuppliesFilterOptions = [];

    if (includeAllOption) {
      options.push({
        id: '-1',
        text: 'Tất cả',
      });
    }
    if (suppliesStores) {
      options.push(
        ...suppliesStores.map((suppliesStore) => ({
          id: suppliesStore.maVt,
          text: suppliesStore.tenVt,
          tenVt: suppliesStore.tenVt,
          tenGoiNho: suppliesStore.tenGoiNho,
          dvt: suppliesStore.dvt,
          maVt: suppliesStore.maVt,
          maNhom: suppliesStore.maNhom,
          thoiHanLuuKho: suppliesStore.thoiHanLuuKho,
        })),
      );
    }

    return options;
  }, [includeAllOption, suppliesStores]);

  const getSuppliesOptionTextById = useCallback(
    (id: number) => {
      if (!suppliesOptions) {
        return '';
      }
      for (const suppliesStoreOption of suppliesOptions) {
        if (suppliesStoreOption.id === String(id)) {
          return suppliesStoreOption.text;
        }
      }
      return '';
    },
    [suppliesOptions],
  );

  return { suppliesOptions, suppliesIsLoading, getSuppliesOptionTextById };
}

export default useSuppliesOptions;
