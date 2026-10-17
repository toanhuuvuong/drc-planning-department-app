import { useKhotpMasterKhoControllerFind } from 'main/apis/drc/endpoints/khotp-master-kho-controller/khotp-master-kho-controller';
import { KhotpMasterKhoControllerFindParams } from 'main/apis/drc/models';
import { ALL_KHO_PERMISSION_VALUE } from 'main/constants/common-constants';
import { useAppSelector } from 'main/redux/hooks';
import { SelectOption } from 'main/types/select-option';
import { useMemo } from 'react';

function useProductStoreOptions(
  includeAllOption?: boolean,
  filterAllowedKho: boolean = false,
  productStoreLocationCode?: string | null,
  productStoreLocationCodeError?: string | null,
) {
  const dsKhoTpPermission = useAppSelector((state) => state.auth.dsKhoTpPermission);
  let khoFilter: KhotpMasterKhoControllerFindParams = {};

  if (filterAllowedKho) {
    let listKhoId: string[];
    if (dsKhoTpPermission === undefined || dsKhoTpPermission === null || dsKhoTpPermission.length === 0) {
      // No permission with any product store
      listKhoId = [];
    } else {
      // Limit product store with permission
      listKhoId = dsKhoTpPermission;
    }

    // Exclude 'ALL' value as the user has permission on all product stores
    if (dsKhoTpPermission && dsKhoTpPermission.length > 0 && dsKhoTpPermission[0] !== ALL_KHO_PERMISSION_VALUE) {
      khoFilter = {
        filter: {
          where: {
            maKho: {
              inq: listKhoId,
            },
          },
        },
      };
    }
  }

  // React Query
  const { data: productStores, isLoading: productStoresIsLoading } = useKhotpMasterKhoControllerFind(khoFilter);

  // React Function
  const productStoreOptions = useMemo(() => {
    const options: SelectOption[] = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (productStores) {
      options.push(
        ...productStores
          .filter((productStore) => {
            if (productStoreLocationCode && !productStoreLocationCodeError) {
              return productStore.khoAndViTris?.some(
                (khoAndViTri) => khoAndViTri.maViTriKho === productStoreLocationCode,
              );
            }
            return true;
          })
          .map((productStore) => ({
            id: productStore.maKho,
            text: `${productStore.maKho} - ${productStore.tenKho}`,
          })),
      );
    }

    return options;
  }, [includeAllOption, productStoreLocationCode, productStoreLocationCodeError, productStores]);

  return { productStoreOptions, productStoresIsLoading };
}

export default useProductStoreOptions;
