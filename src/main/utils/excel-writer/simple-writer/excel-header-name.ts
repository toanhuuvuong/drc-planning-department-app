export function getApiFieldsForExport(columns: any[]) {
  return columns.filter((column) => column.csvExport !== false).map((column) => column.dataField);
}

export function getColumnNameForExport(columns: any[]) {
  return columns.filter((column) => column.csvExport !== false).map((column) => column.text);
}
