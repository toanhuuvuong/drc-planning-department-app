import { RequirementsStandardSetType } from 'main/constants/enums';
import { useMemo } from 'react';

function useRequirementsStandardSetTypeOptions(includeAllOption?: boolean) {
  // React Function
  const requirementsStandardSetTypeOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(RequirementsStandardSetType));

    return options;
  }, [includeAllOption]);

  return requirementsStandardSetTypeOptions;
}

export default useRequirementsStandardSetTypeOptions;
