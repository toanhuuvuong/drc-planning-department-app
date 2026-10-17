export type TableState<T> = {
  page: number;
  sizePerPage: number;
  sortField?: string;
  sortOrder?: string;
  selectedRows?: T[];
};
