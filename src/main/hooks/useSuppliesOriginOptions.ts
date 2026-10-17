import { useKhovtMasterNguonGocControllerFind } from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller';
import { useMemo } from 'react';

function useSuppliesOriginOptions(includeAllOption?: boolean) {
  // React Query
  const { data: suppliesOrigins, isLoading: suppliesOriginsIsLoading } = useKhovtMasterNguonGocControllerFind();

  // React Function
  const suppliesOriginOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (suppliesOrigins) {
      options.push(
        ...suppliesOrigins.map((suppliesOrigin) => ({
          id: suppliesOrigin.id,
          text: `${suppliesOrigin.tenNhaSx} - ${suppliesOrigin.nuoc?.tenNuocVn}`,
        })),
      );
    }

    return options;
  }, [includeAllOption, suppliesOrigins]);

  return { suppliesOriginOptions, suppliesOriginsIsLoading };
}

export default useSuppliesOriginOptions;
