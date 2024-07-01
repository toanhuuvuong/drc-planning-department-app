import { useKhovtMasterNguonGocControllerFind } from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller';
import { useKhovtMasterVtControllerFind } from 'main/apis/drc/endpoints/khovt-master-vt-controller/khovt-master-vt-controller';
import { useKhovtNhomControllerFind } from 'main/apis/drc/endpoints/khovt-nhom-controller/khovt-nhom-controller';
import { KhovtMasterVtWithRelations } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { ChangeEvent, useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import Select2 from 'react-select2-wrapper';
import { Button, Col, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { addSuppliesModalTableColumns, tableCellEdit, tableSelectRow } from './configs';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: (selectedSupplies: KhovtMasterVtWithRelations[]) => void;
};

function AddSuppliesModal({ isOpen, toggle, handleConfirmClick }: Props) {
  // React State
  const [filterSuppliesGroup, setFilterSuppliesGroup] = useState<string>('');
  const [filterSuppliesCode, setFilterSuppliesCode] = useState<string>('');
  const [filterBatchCode, setFilterBatchCode] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [tableSelectedRowIds, setTableSelectedRowIds] = useState<string[]>([]);
  const [tableSelectedRows, setTableSelectedRows] = useState<KhovtMasterVtWithRelations[]>([]);

  // React Query hooks
  const { data: suppliesGroups } = useKhovtNhomControllerFind();
  const { data: suppliesCodes } = useKhovtMasterVtControllerFind();
  const { data: batches } = useKhovtMasterNguonGocControllerFind();
  const { data: supplies, isLoading: suppliesIsLoading } = useKhovtMasterVtControllerFind(
    {
      filter: /*searching
        ? {
            //offset: 0,
            //limit: 100,
            //skip: 0,
            //order: 'string',
            where: {
              maNhom: filterSuppliesCode && filterSuppliesCode !== '-1' ? filterSuppliesCode : undefined,
              maVt: filterSuppliesGroup && filterSuppliesGroup !== '-1' ? filterSuppliesGroup : undefined,
              //maLo: filterBatchCode && filterBatchCode !== '-1' ? filterBatchCode : undefined,
            },
          }
        :*/ undefined,
    },
    {
      query: {
        enabled: searching,
      },
    },
  );

  // React Efftect
  useEffect(() => {
    if (suppliesIsLoading) {
      // Reset search flag
      setSearching(false);
    }
  }, [suppliesIsLoading]);

  // React fucnction
  const handleSearchClick = () => {
    setSearching(true);
  };

  const handleTableRowSelect = (row: KhovtMasterVtWithRelations, isSelect: boolean) => {
    if (!row || !row.dvt) {
      return;
    }
    if (isSelect) {
      setTableSelectedRowIds([...tableSelectedRowIds, row.dvt]);
      setTableSelectedRows([...tableSelectedRows, row]);
    } else {
      setTableSelectedRowIds(tableSelectedRowIds.filter((item) => item !== row.dvt));
      setTableSelectedRows(tableSelectedRows.filter((item) => item.dvt !== row.dvt));
    }
  };

  const handleTableRowSelectAll = (isSelect: boolean, rows: KhovtMasterVtWithRelations[]) => {
    const ids = rows.filter((r) => r.dvt).map((r) => r.dvt);
    if (isSelect) {
      setTableSelectedRowIds(ids);
      setTableSelectedRows(rows);
    } else {
      setTableSelectedRows([]);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="xl">
      <ModalHeader toggle={toggle}>Thêm vật tư</ModalHeader>
      <ModalBody>
        <div className="px-4 pb-1">
          <Form>
            <Row>
              <Col md={12} lg={4}>
                <FormGroup className="row">
                  <Label className="form-control-label" md="3">
                    Nhóm vật tư
                  </Label>
                  <Col md="9">
                    <Select2
                      className="form-control"
                      options={{
                        placeholder: 'Chọn nhóm vật tư',
                      }}
                      value={filterSuppliesGroup}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterSuppliesGroup(e.target.value)}
                      data={[
                        { id: '-1', text: 'Tất cả' },
                        ...(suppliesGroups?.map((group) => ({ id: group.id, text: group.maNhom })) || []),
                      ]}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col md={12} lg={4}>
                <FormGroup className="row">
                  <Label className="form-control-label" md="3">
                    Mã vật tư
                  </Label>
                  <Col md="9">
                    <Select2
                      className="form-control"
                      options={{
                        placeholder: 'Chọn mã vật tư',
                      }}
                      value={filterSuppliesCode}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterSuppliesCode(e.target.value)}
                      data={[
                        { id: '-1', text: 'Tất cả' },
                        ...(suppliesCodes?.map((code) => ({ id: code.maVt, text: code.maVt })) || []),
                      ]}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col md={12} lg={4}>
                <FormGroup className="row">
                  <Label className="form-control-label" md="3">
                    Mã lô
                  </Label>
                  <Col md="9">
                    <Select2
                      className="form-control"
                      options={{
                        placeholder: 'Chọn mã lô',
                      }}
                      value={filterBatchCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterBatchCode(e.target.value)}
                      data={[
                        { id: '-1', text: 'Tất cả' },
                        ...(batches?.map((batch) => ({ id: batch.id, text: batch.maNguonGoc })) || []),
                      ]}
                    />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button color="primary" onClick={handleSearchClick}>
                Tìm
              </Button>
            </div>
          </Form>
        </div>
        {!supplies || supplies.length === 0 ? (
          <BasicSpinner />
        ) : (
          <ToolkitProvider data={supplies} keyField="dvt" columns={addSuppliesModalTableColumns}>
            {(props: any) => (
              <div className="table-responsive py-4">
                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4={true}
                  bordered={false}
                  cellEdit={tableCellEdit}
                  selectRow={{
                    ...tableSelectRow,
                    selected: tableSelectedRowIds,
                    onSelect: handleTableRowSelect,
                    onSelectAll: handleTableRowSelectAll,
                  }}
                  noDataIndication="Không có kết quả nào được tìm thấy"
                />
              </div>
            )}
          </ToolkitProvider>
        )}
      </ModalBody>
      <ModalFooter className="justify-content-between">
        <Button color="primary" onClick={() => handleConfirmClick(tableSelectedRows)}>
          Thêm
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default AddSuppliesModal;
