import { useKhovtTransPhieuXuatControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import { KhovtMasterVt } from 'main/apis/drc/models';
import { useCallback, useMemo } from 'react';

export type SuppliesFilter = {
  id: any;
  text: any;
  maVt?: string;
  tenVt?: string;
  soLo?: string;
  maLo?: string;
  idNhap?: number;
  nguonGoc?: string;
  soLuong?: number;
  tonKho?: number;
  ngayHetHanLK?: KhovtMasterVt['thoiHanLuuKho'];
  maKho?: string;
};

export type SuppliesFilterOptions = SuppliesFilter[];

function useSuppliesExportOptions(includeAllOption?: boolean) {
  const { data, isLoading: suppliesIsLoading } = useKhovtTransPhieuXuatControllerFindDetail();

  // React Function
  const suppliesOptions = useMemo(() => {
    const options: SuppliesFilterOptions = [];

    if (includeAllOption) {
      options.push({
        id: '-1',
        text: 'Tất cả',
      });
    }
    if (data) {
      const dataSupplier = data?.data?.map((item) => ({
        ...item,
        id: item.id,
        text: item.tenVt,
        idNhap: item.id,
      })) as any;

      options.push(...dataSupplier);
    }

    return options;
  }, [includeAllOption, data]);

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

export default useSuppliesExportOptions;
