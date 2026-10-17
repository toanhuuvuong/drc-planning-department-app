import { useMemo } from 'react';

const useTableDataWithUniqueKey = (data?: any[], ...fieldNames: string[]) => {
  const dataWithUniqueKey = useMemo(() => {
    if (data) {
      return data.map((row) => ({
        ...row,
        uniqueKey: generateUniqueKeyForRow(row, fieldNames),
      }));
    }
    return [];
  }, [data, fieldNames]);

  return dataWithUniqueKey;
};

const generateUniqueKeyForRow = (row: any, fieldNames: string[]) => {
  const uniqueKey = fieldNames.reduce((prev, fieldName, index) => {
    if (index === 0) {
      return row[fieldName];
    }
    return `${prev}_${row[fieldName]}`;
  }, '');
  return uniqueKey;
};

export default useTableDataWithUniqueKey;
