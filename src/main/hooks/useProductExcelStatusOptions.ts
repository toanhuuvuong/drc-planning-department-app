import { ProductExcelStatus } from 'main/constants/enums';
import { useMemo } from 'react';

function useProductExcelStatusOptions(includeAllOption?: boolean) {
  // React Function
  const productExcelStatusOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(ProductExcelStatus));

    return options;
  }, [includeAllOption]);

  return productExcelStatusOptions;
}

export default useProductExcelStatusOptions;
