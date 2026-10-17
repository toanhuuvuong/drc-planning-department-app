import {
  useKhovtMasterVtControllerCount,
  useKhovtMasterVtControllerFind,
} from 'main/apis/drc/endpoints/khovt-master-vt-controller/khovt-master-vt-controller';
import { KhovtMasterVtWithRelations } from 'main/apis/drc/models';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import { SuppliesFilter } from 'main/redux/modules/supplies-store-import/supplies-store-import-add-slice';
import {
  resetSuppliesFilterAndTable,
  selectSuppliesFilter,
  selectSuppliesTable,
  selectSuppliesTableExcludeSelectedRows,
  selectSuppliesTriggerFlag,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-edit-slice';
import { TableState } from 'main/types';
import { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AddSuppliesModalFilter from './add-supplies-modal-filter';
import AddSuppliesModalTable from './add-supplies-modal-table/add-supplies-modal-table';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: (selectedSuppliesRows?: KhovtMasterVtWithRelations[]) => void;
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
  const { data: supplies, isLoading: suppliesIsLoading } = useKhovtMasterVtControllerFind(
    getSuppliesParams(filter, tableExcludeSelectedRows),
    {
      query: {
        queryKey: ['supplies', filter, tableExcludeSelectedRows, triggerFlag],
        enabled: isOpen,
      },
    },
  );

  const { data: suppliesCount, isLoading: suppliesCountIsLoading } = useKhovtMasterVtControllerCount(
    getSuppliesCountParams(filter),
    {
      query: {
        queryKey: ['suppliesCount', filter, triggerFlag],
      },
    },
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="xl">
      <ModalHeader toggle={toggle}>Thêm vật tư</ModalHeader>
      <ModalBody>
        <AddSuppliesModalFilter />
        <hr />
        <AddSuppliesModalTable
          data={supplies}
          dataIsLoading={suppliesIsLoading}
          dataCount={suppliesCount?.count}
          dataCountIsLoading={suppliesCountIsLoading}
        />
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

const getSuppliesParams = (filter: SuppliesFilter, table: TableState<KhovtMasterVtWithRelations>) => {
  const where = getSuppliesCountParams(filter).where;
  const { page, sizePerPage, sortField, sortOrder } = table;

  return {
    filter: {
      offset: (page - 1) * sizePerPage,
      limit: sizePerPage,
      order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
      where,
    },
  };
};

const getSuppliesCountParams = (filter: SuppliesFilter) => {
  const { suppliesGroup, suppliesCode, suppliesName, suppliesSuggestiveName } = filter;
  return {
    where: {
      maNhom: suppliesGroup && suppliesGroup !== '-1' ? suppliesGroup : undefined,
      maVt: suppliesCode ? suppliesCode : undefined,
      tenVt: { like: suppliesName ? `%${suppliesName}%` : undefined },
      tenGoiNho: { like: suppliesSuggestiveName ? `%${suppliesSuggestiveName}%` : undefined },
    },
  };
};

export default AddSuppliesModal;
