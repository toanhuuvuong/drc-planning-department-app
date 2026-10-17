import { useKhovtTransPhieuNhapControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  resetSuppliesFilterAndTable,
  selectSuppliesFilter,
  selectSuppliesTable,
  selectSuppliesTableExcludeSelectedRows,
  selectSuppliesTriggerFlag,
  SuppliesFilter,
} from 'main/redux/modules/supplies-store-export/supplies-store-export-add-slice';
import { TableState } from 'main/types';
import { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AddSuppliesModalFilter from './add-supplies-modal-filter';
import AddSuppliesModalTable from './add-supplies-modal-table/add-supplies-modal-table';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: (selectedSuppliesList?: KhovtTransPhieuNhapControllerFindDetail200DataItem[]) => void;
};

function AddSuppliesModal({ isOpen, toggle, handleConfirmClick }: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectSuppliesFilter);
  const table = useAppSelector(selectSuppliesTable);
  const tableExcludeSelectedRows = useAppSelector(selectSuppliesTableExcludeSelectedRows);
  const triggerFlag = useAppSelector(selectSuppliesTriggerFlag);

  // React Effect
  useEffect(() => {
    if (isOpen) {
      dispatch(resetSuppliesFilterAndTable());
    }
  }, [dispatch, isOpen]);

  // React Query
  const { data: supplies, isLoading: suppliesIsLoading } = useKhovtTransPhieuNhapControllerFindDetail(
    getSuppliesParams(filter, table),
    {
      query: {
        queryKey: ['supplies', filter, tableExcludeSelectedRows, triggerFlag],
        enabled: isOpen,
      },
    },
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="xl">
      <ModalHeader toggle={toggle}>Thêm vật tư</ModalHeader>
      <ModalBody>
        <AddSuppliesModalFilter />
        <hr />
        <AddSuppliesModalTable data={supplies} dataIsLoading={suppliesIsLoading} />
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="primary" onClick={() => handleConfirmClick(table.selectedRows)}>
          Thêm
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const getSuppliesParams = (
  filter: SuppliesFilter,
  table: TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>,
) => {
  const where = getSuppliesCountParams(filter).where;
  const { page, sizePerPage, sortField, sortOrder } = table;

  return {
    filter: {
      skip: (page - 1) * sizePerPage,
      limit: sizePerPage,
      order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
      where,
    },
  };
};

const getSuppliesCountParams = (filter: SuppliesFilter) => {
  const { suppliesGroup, suppliesCode, batchCode, suppliesStoreCode } = filter;
  return {
    where: {
      maNhom: suppliesGroup && suppliesGroup !== '-1' ? suppliesGroup : undefined,
      maVt: suppliesCode ? suppliesCode : undefined,
      soLo: batchCode ? batchCode : undefined,
      maKho: suppliesStoreCode ? suppliesStoreCode : undefined,
      tonKho: { gt: 0 },
    },
  };
};

export default AddSuppliesModal;
