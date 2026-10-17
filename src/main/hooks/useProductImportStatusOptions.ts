import { ProductImportStatus } from 'main/constants/enums';
import { useMemo } from 'react';

function useProductImportStatusOptions(includeAllOption?: boolean) {
  // React Function
  const productImportStatusOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(ProductImportStatus));

    return options;
  }, [includeAllOption]);

  return productImportStatusOptions;
}

export default useProductImportStatusOptions;
