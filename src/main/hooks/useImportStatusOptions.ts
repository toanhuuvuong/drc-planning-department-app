import { ImportStatus } from 'main/constants/enums';
import { useMemo } from 'react';

function useImportStatusOptions(includeAllOption?: boolean) {
  // React Function
  const importStatusOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(ImportStatus));

    return options;
  }, [includeAllOption]);

  return importStatusOptions;
}

export default useImportStatusOptions;
