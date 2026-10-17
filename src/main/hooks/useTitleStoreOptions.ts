import { useFTitleControllerFind } from 'main/apis/drc/endpoints/ftitle-controller/ftitle-controller';
import { useMemo } from 'react';

function useTitleStoreOptions(includeDefaultOption?: boolean, defaultOptionText?: string) {
  // React Query
  const { data: titleData, isSuccess, refetch } = useFTitleControllerFind();

  // React Function
  const titleStoreOptions = useMemo(() => {
    const options = [];

    if (includeDefaultOption) {
      options.push({ id: '-1', text: defaultOptionText ?? 'Tất cả' });
    }

    if (titleData) {
      options.push(...titleData.map((title) => ({ id: title.id!.toString(), text: title.name })));
    }

    return options;
  }, [defaultOptionText, includeDefaultOption, titleData]);

  return { titleStoreOptions, isSuccess, refetch };
}

export default useTitleStoreOptions;
