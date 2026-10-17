import { useKhovtNhomControllerFind } from 'main/apis/drc/endpoints/khovt-nhom-controller/khovt-nhom-controller';
import { useMemo } from 'react';

function useSuppliesGroupOptions(includeAllOption?: boolean) {
  // React Query
  const { data: suppliesGroups, isLoading: suppliesGroupsIsLoading } = useKhovtNhomControllerFind();

  // React Function
  const suppliesGroupOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (suppliesGroups) {
      options.push(
        ...suppliesGroups.map((suppliesGroup) => ({ id: suppliesGroup.maNhom, text: suppliesGroup.tenNhom })),
      );
    }

    return options;
  }, [includeAllOption, suppliesGroups]);

  return { suppliesGroupOptions, suppliesGroupsIsLoading };
}

export default useSuppliesGroupOptions;
