import { useFDepartmentControllerFind } from 'main/apis/drc/endpoints/fdepartment-controller/fdepartment-controller';
import { useMemo } from 'react';

function useDepartmentStoreOptions(includeAllOption?: boolean) {
  // React Query
  const { data: departmentData, isSuccess } = useFDepartmentControllerFind();

  // React Function
  const departmentStoreOptions = useMemo(() => {
    const options = [];

    if (includeAllOption) {
      options.push({ id: '-1', text: 'Tất cả' });
    }

    if (departmentData) {
      options.push(...departmentData.map((dep) => ({ id: dep.id!.toString(), text: dep.name })));
    }

    return options;
  }, [includeAllOption, departmentData]);

  return { departmentStoreOptions, isSuccess };
}

export default useDepartmentStoreOptions;
