import {
  useKhotpTransPhieuXuatControllerDeleteById,
  useKhotpTransPhieuXuatControllerFindDetail,
} from 'main/apis/drc/endpoints/khotp-trans-phieu-xuat-controller/khotp-trans-phieu-xuat-controller';
import { KhotpTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { TableState } from 'main/types';
import moment, { Moment } from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
import { ProductExportFilter } from './sub-components/product-store-export-filter';

const useHandleProductStoreExportList = () => {
  const [filter, setFilter] = useState<ProductExportFilter>({
    maKhoXuat: '-1',
    maKh: '-1',
    status: '-1',
    searchKey: '',
  });

  const [table, setTable] = useState<TableState<KhotpTransPhieuXuatControllerFindDetail200DataItem>>({
    page: 1,
    sizePerPage: 10,
  });

  const [isOpenCancelModal, setOpenCancelModal] = useState(false);
  const [productExportBillId, setProductExportBillId] = useState<String>();

  const { isPending: deletedProductExportBillIsPending, mutateAsync: deletedProductExportBillMutateAsync } =
    useKhotpTransPhieuXuatControllerDeleteById();

  const toggleCancelModal = useCallback(
    (rowId?: String) => {
      if (rowId) {
        setProductExportBillId(rowId);
      }
      setOpenCancelModal(!isOpenCancelModal);
    },
    [isOpenCancelModal],
  );

  const handleCancelBillPopup = () => {
    setOpenCancelModal(!isOpenCancelModal);
  };

  const getProductExportBillsParams = useCallback(
    (filter: ProductExportFilter, table: TableState<KhotpTransPhieuXuatControllerFindDetail200DataItem>) => {
      const where = getProductExportBillsCountParams(filter).where;
      const { page, sizePerPage, sortField, sortOrder } = table;

      return {
        filter: {
          skip: (page - 1) * sizePerPage,
          limit: sizePerPage,
          order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
          where,
        },
      };
    },
    [],
  );

  const getProductExportBillsCountParams = (filter: ProductExportFilter) => {
    const { startDate, endDate, maKhoXuat, maKh, searchField, searchKey, status } = filter;
    const searchPredicate = searchField
      ? {
          [searchField]: searchKey ? searchKey : undefined,
        }
      : {};
    return {
      where: {
        maKhoXuat: maKhoXuat && maKhoXuat !== '-1' ? maKhoXuat : undefined,
        // maSanPham: maSanPham && maSanPham !== '-1' ? maSanPham : undefined,
        maKh: maKh && maKh !== '-1' ? maKh : undefined,
        ngayXuat:
          startDate && endDate ? { gte: startDate && startDate.toDate(), lte: endDate && endDate.toDate() } : undefined,
        // and:
        //   startDate && endDate
        //     ? [{ ngayXuat: { gte: DateUtil.toISOString(startDate.startOf('day')) } }, { ngayXuat: { lte: DateUtil.toISOString(endDate.endOf('day')) } }]
        //     : undefined,
        status: status && status !== '-1' ? status : undefined,
        // trangThai: status && status !== '-1' ? status : undefined,
        searchKey: searchKey ? { eq: searchKey } : undefined,
        ...searchPredicate,
      },
    };
  };

  const memoizedParams = useMemo(
    () => getProductExportBillsParams(filter, table),
    [filter, getProductExportBillsParams, table],
  );

  const {
    data: productExportBills,
    isLoading: productExportBillsIsLoading,
    refetch: productExportBillsRefetch,
  } = useKhotpTransPhieuXuatControllerFindDetail(memoizedParams);

  const handleSearchClick = (newFilter: ProductExportFilter) => {
    setFilter(newFilter);
    setTable({ ...table, page: 1 });
  };

  const handleTableChange = (
    _: TableChangeType,
    newState: TableChangeState<KhotpTransPhieuXuatControllerFindDetail200DataItem>,
  ) => {
    const { page, sizePerPage, sortField, sortOrder } = newState;
    setTable({ ...table, page, sizePerPage, sortOrder, sortField });
  };

  const handleCancelModalConfirmClick = useCallback(() => {
    toggleCancelModal();
    deletedProductExportBillMutateAsync({ id: Number(productExportBillId) })
      .then((_) => {
        // Refresh table data
        productExportBillsRefetch();
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedProductExportBillMutateAsync, productExportBillId, productExportBillsRefetch, toggleCancelModal]);

  const handleDateChange = useCallback(
    (
      fieldName: string,
      setFieldValue: (fieldName: string, value: any) => any,
      value?: string | Moment,
      startDate?: Moment,
      endDate?: Moment,
    ) => {
      if (!value) {
        setFieldValue(fieldName, undefined);
        return;
      }

      const currentDate = moment(value);
      if (
        (fieldName === FieldName.START_DATE && endDate && endDate.toDate() < currentDate.toDate()) ||
        (fieldName === FieldName.END_DATE && startDate && startDate.toDate() > currentDate.toDate())
      ) {
        setFieldValue(FieldName.START_DATE, currentDate);
        setFieldValue(FieldName.END_DATE, currentDate);
      } else {
        setFieldValue(fieldName, currentDate);
      }
    },
    [],
  );

  return {
    deletedProductExportBillIsPending,
    filter,
    handleCancelBillPopup,
    handleCancelModalConfirmClick,
    handleDateChange,
    handleSearchClick,
    handleTableChange,
    isOpenCancelModal,
    productExportBillId,
    productExportBills: productExportBills?.data,
    productExportBillsCount: productExportBills?.count,
    productExportBillsIsLoading,
    table,
    toggleCancelModal,
  };
};

export default useHandleProductStoreExportList;
