import { useKhovtMasterDonViControllerFind } from 'main/apis/drc/endpoints/khovt-master-don-vi-controller/khovt-master-don-vi-controller';
import { useKhovtMasterNguonGocControllerFind } from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller';
import { useMemo } from 'react';

function useSuppliesUnitAndOriginOptions(includeAllOption?: boolean) {
  // React Query
  const { data: suppliesOrigins, isLoading: suppliesOriginsIsLoading } = useKhovtMasterNguonGocControllerFind();
  const { data: suppliesUnits, isLoading: suppliesUnitsIsLoading } = useKhovtMasterDonViControllerFind();

  // React Function
  const suppliesUnitAndOriginOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (suppliesUnits) {
      options.push(
        ...suppliesUnits.map((suppliesUnit) => ({
          id: suppliesUnit.maDonVi,
          text: suppliesUnit.tenDonVi,
        })),
      );
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
  }, [includeAllOption, suppliesOrigins, suppliesUnits]);

  return {
    suppliesUnitAndOriginOptions,
    suppliesUnitsAndOriginsIsLoading: suppliesOriginsIsLoading || suppliesUnitsIsLoading,
  };
}

export default useSuppliesUnitAndOriginOptions;
