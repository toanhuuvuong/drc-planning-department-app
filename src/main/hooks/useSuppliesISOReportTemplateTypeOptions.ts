import { SuppliesISOReportTemplateType } from 'main/constants/enums';
import { useMemo } from 'react';

function useSuppliesISOReportTemplateTypeOptions(includeAllOption?: boolean) {
  // React Function
  const suppliesISOReportTemplateTypeOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    options.push(...Object.values(SuppliesISOReportTemplateType));

    return options;
  }, [includeAllOption]);

  return suppliesISOReportTemplateTypeOptions;
}

export default useSuppliesISOReportTemplateTypeOptions;
