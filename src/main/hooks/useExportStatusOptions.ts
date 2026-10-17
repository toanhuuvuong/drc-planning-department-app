import { ExportStatus } from 'main/constants/enums';
import { useMemo } from 'react';

function useExportStatusOptions(includeAllOption?: boolean) {
  // React Function
  const exportStatusOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(ExportStatus));

    return options;
  }, [includeAllOption]);

  return exportStatusOptions;
}

export default useExportStatusOptions;
