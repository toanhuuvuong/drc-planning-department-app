import { ProductExcelTemplateType } from 'main/constants/enums';
import { useMemo } from 'react';

function useProductExcelTemplateTypeOptions(includeAllOption?: boolean) {
  // React Function
  const productExcelStatusOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(ProductExcelTemplateType));

    return options;
  }, [includeAllOption]);

  return productExcelStatusOptions;
}

export default useProductExcelTemplateTypeOptions;
