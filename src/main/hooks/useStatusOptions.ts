import { ExportStatus } from 'main/constants/enums/product-store-export-status';
import { useMemo } from 'react';

const useStatusOptions = (includeAllOption?: boolean, statusOptions: ExportStatus[] = []) => {
  const exportStatusOptions = useMemo(() => {
    if (includeAllOption) {
      return [{ id: '-1', text: 'Tất cả' }, ...statusOptions];
    }
    return statusOptions;
  }, [includeAllOption, statusOptions]);

  return exportStatusOptions;
};

export default useStatusOptions;
