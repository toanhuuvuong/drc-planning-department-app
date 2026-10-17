import { getApiFieldsForExport, getColumnNameForExport } from 'main/utils/excel-writer/simple-writer/excel-header-name';
import exportJsonToExcel from 'main/utils/excel-writer/simple-writer/simple-excel-writer';

export const exportCurrentDataOfKhoVatTuToExcel = async (
  jsonData: Array<Record<string, any>> | undefined,
  configColumns: any[],
) => {
  const dataFields = getApiFieldsForExport(configColumns);
  const columnNames = getColumnNameForExport(configColumns);
  return await exportJsonToExcel(jsonData, dataFields, columnNames);
};
