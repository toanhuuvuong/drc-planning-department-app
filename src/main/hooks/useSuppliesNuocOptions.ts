import { useKhovtMasterNguonGocControllerFindNuoc } from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller';
import { useMemo } from 'react';

function useSuppliesNuocOptions(includeAllOption?: boolean) {
  // React Query
  const { data: nuocData, isLoading: nuocDataIsLoading } = useKhovtMasterNguonGocControllerFindNuoc();

  // React Function
  const suppliesNuocOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (nuocData) {
      options.push(...nuocData.map((nuoc) => ({ id: nuoc.maNuoc, text: nuoc.tenNuocVn })));
    }

    return options;
  }, [includeAllOption, nuocData]);

  return { suppliesNuocOptions, nuocDataIsLoading };
}

export default useSuppliesNuocOptions;
