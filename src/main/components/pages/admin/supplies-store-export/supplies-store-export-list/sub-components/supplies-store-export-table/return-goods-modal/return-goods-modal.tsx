import { KhovtTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { useCallback, useEffect, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import tableConfig from './table-config';

export type ReturnGoodsType = KhovtTransPhieuXuatControllerFindDetail200DataItem & {
  soLuongTraHang?: number;
  lyDoTraHang?: string;
  nguoiNhanHang?: string;
};

type Props = {
  data?: ReturnGoodsType;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: (returnGoods?: ReturnGoodsType) => void;
};

function ReturnGoodsModal({ data, isOpen, toggle, handleConfirmClick }: Props) {
  // React State
  const [returnGoods, setReturnGoods] = useState<ReturnGoodsType>();

  // React Effect
  useEffect(() => {
    setReturnGoods(data);
  }, [data]);

  // React Function
  const handleTableChange = useCallback((type: TableChangeType, newState: TableChangeState<ReturnGoodsType>) => {
    if (type === 'cellEdit') {
      const {
        cellEdit: { dataField, newValue },
      } = newState;
      setReturnGoods((returnGoods) => ({ ...returnGoods, [dataField]: newValue }));
    }
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader toggle={toggle}>TRẢ HÀNG DỰA TRÊN PHIẾU XUẤT</ModalHeader>
      <ModalBody>
        <>
          <ToolkitProvider
            data={returnGoods ? [returnGoods] : []}
            keyField={FieldName.ID}
            columns={tableConfig.columns}>
            {(props: any) => (
              <>
                <div className="table-responsive">
                  <BootstrapTable
                    {...props.baseProps}
                    remote
                    bootstrap4
                    bordered={false}
                    cellEdit={cellEditFactory(tableConfig.cellEdit)}
                    onTableChange={handleTableChange}
                  />
                </div>
                <p className="text-sm mt-2">
                  <em>&#40;Nhấn 2 lần vào ô bạn muốn chỉnh sửa&#41;</em>
                </p>
              </>
            )}
          </ToolkitProvider>
        </>
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button
          disabled={
            !returnGoods || !returnGoods.soLuongTraHang || !returnGoods.nguoiNhanHang || !returnGoods.lyDoTraHang
          }
          color="primary"
          onClick={() => handleConfirmClick(returnGoods)}>
          Xác nhận
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ReturnGoodsModal;
