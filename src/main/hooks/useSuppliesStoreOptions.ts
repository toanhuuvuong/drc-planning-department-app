import { useKhovtMasterKhoControllerFind } from 'main/apis/drc/endpoints/khovt-master-kho-controller/khovt-master-kho-controller';
import { KhovtMasterKhoControllerFindParams } from 'main/apis/drc/models';
import { ALL_KHO_PERMISSION_VALUE } from 'main/constants/common-constants';
import { useAppSelector } from 'main/redux/hooks';
import { SelectOption } from 'main/types/select-option';
import { useCallback, useMemo } from 'react';

function useSuppliesStoreOptions(includeAllOption?: boolean, filterAllowedKho: boolean = false) {
  const dsKhoVtPermission = useAppSelector((state) => state.auth.dsKhoVtPermission);
  let khoFilter: KhovtMasterKhoControllerFindParams = {};

  if (filterAllowedKho) {
    let listKhoId: number[];
    if (dsKhoVtPermission === undefined || dsKhoVtPermission === null || dsKhoVtPermission.length === 0) {
      // No permission with any supplies store
      listKhoId = [];
    } else {
      // Limit supplies store with permission
      listKhoId = dsKhoVtPermission;
    }

    // Exclude 'ALL' value as the user has permission on all supplies stores
    if (
      dsKhoVtPermission &&
      dsKhoVtPermission.length > 0 &&
      dsKhoVtPermission[0].toString() !== ALL_KHO_PERMISSION_VALUE
    ) {
      khoFilter = {
        filter: {
          where: {
            id: {
              inq: listKhoId,
            },
          },
        },
      };
    }
  }

  // React Query
  const { data: suppliesStores, isLoading: suppliesStoresIsLoading } = useKhovtMasterKhoControllerFind(khoFilter);

  // React Function
  const suppliesStoreOptions = useMemo(() => {
    const options: SelectOption[] = [];

    if (includeAllOption) {
      options.push({ id: -1, text: 'Tất cả' });
    }

    if (suppliesStores) {
      options.push(
        ...suppliesStores.map((suppliesStore) => ({
          id: suppliesStore.id!,
          text: suppliesStore.tenKho,
          maKho: suppliesStore.maKho,
        })),
      );
    }

    return options;
  }, [includeAllOption, suppliesStores]);

  const getSuppliesStoreOptionTextById = useCallback(
    (id: number) => {
      if (!suppliesStoreOptions) {
        return '';
      }
      for (const suppliesStoreOption of suppliesStoreOptions) {
        if (suppliesStoreOption.id === id) {
          return suppliesStoreOption.text;
        }
      }
      return '';
    },
    [suppliesStoreOptions],
  );

  const getSuppliesStoreOptionMaKhoById = useCallback(
    (id: number) => {
      if (!suppliesStoreOptions) {
        return '';
      }
      for (const suppliesStoreOption of suppliesStoreOptions) {
        if (suppliesStoreOption.id === id) {
          return suppliesStoreOption.maKho;
        }
      }
      return '';
    },
    [suppliesStoreOptions],
  );

  return {
    suppliesStoreOptions,
    suppliesStoresIsLoading,
    getSuppliesStoreOptionTextById,
    getSuppliesStoreOptionMaKhoById,
  };
}

export default useSuppliesStoreOptions;
