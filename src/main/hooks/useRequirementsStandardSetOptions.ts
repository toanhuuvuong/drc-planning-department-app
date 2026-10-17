import { useDmMasterBoDinhMucControllerFind } from 'main/apis/drc/endpoints/dm-master-bo-dinh-muc-controller/dm-master-bo-dinh-muc-controller';
import { RequirementsStandardSetType } from 'main/constants/enums';
import { useMemo } from 'react';

function useRequirementsStandardSetOptions(includeAllOption?: boolean) {
  // React Query
  const { data: requirementsStandardSets, isLoading: requirementsStandardSetsIsLoading } =
    useDmMasterBoDinhMucControllerFind();

  // React Function
  const requirementsStandardSetOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (requirementsStandardSets) {
      options.push(
        ...requirementsStandardSets.map((requirementsStandardSet) => ({
          id: requirementsStandardSet.id,
          text:
            RequirementsStandardSetType[
              requirementsStandardSet.loaiBoDinhMuc as keyof typeof RequirementsStandardSetType
            ]?.text +
            ' - ' +
            requirementsStandardSet.maBoDinhMuc,
        })),
      );
    }

    return options;
  }, [includeAllOption, requirementsStandardSets]);

  return { requirementsStandardSetOptions, requirementsStandardSetsIsLoading };
}

export default useRequirementsStandardSetOptions;
