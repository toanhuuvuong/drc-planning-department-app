import { useKhotpTransPhieuXuatControllerCreate } from 'main/apis/drc/endpoints/khotp-trans-phieu-xuat-controller/khotp-trans-phieu-xuat-controller';
import { KhotpTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { Page } from 'main/constants';
import { useCallback, useMemo, useState } from 'react';
import { TableChangeState } from 'react-bootstrap-table-next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export type ProductStoreExportInfo = Omit<KhotpTransPhieuXuatControllerFindDetail200DataItem, 'details'> & {
  id?: number;
  typeAdd?: string;
  isChecked?: boolean;
  ThoiHanLuuKho?: number;
  soLuong?: number;
  ngayNhap?: number;
  soLo?: number;
  solo?: number;
  idNhap?: number;
  viTri?: string;
};

export const useProductStoreExportAdd = () => {
  // React Router
  const navigate = useNavigate();

  const [isOpenSaveCompleteModal, setOpenSaveCompleteModal] = useState(false);
  const [loaiPhieu, setLoaiPhieu] = useState('0');
  const [productExportAddStoreDetails, setProductExportAddStoreDetails] = useState<ProductStoreExportInfo[]>([]);

  const isValidProductDetails = useMemo(() => {
    if (!productExportAddStoreDetails || productExportAddStoreDetails.length === 0) {
      return true;
    }

    return productExportAddStoreDetails?.every((detail) => detail.soLuongYc && detail.soLuongXuat);
  }, [productExportAddStoreDetails]);

  // React Query
  const { mutateAsync: createdProductExportBillMutateAsync } = useKhotpTransPhieuXuatControllerCreate();

  const toggleSaveCompleteModal = useCallback(
    () => setOpenSaveCompleteModal((isOpenSaveCompleteModal) => !isOpenSaveCompleteModal),
    [],
  );

  const normalizeProductDetails = (productDetails: ProductStoreExportInfo[]) => {
    const list: ProductStoreExportInfo[] = [];
    for (const productDetail of productDetails) {
      const {
        ghiChu,
        hanSd,
        id,
        maPhieu,
        maSanPham,
        masterId,
        // soLuong,
        soLuongXuat,
        soLuongYc,
        thangSx,
        tonHienTai,
        viTri,
      } = productDetail;
      list.push({
        // id,
        idNhap: id,
        ghiChu,
        hanSd,
        maPhieu,
        maSanPham,
        soLuongXuat: Number(soLuongXuat),
        soLuongYc: Number(soLuongYc),
        thangSx,
        tonHienTai,
        // tonKho: Number(tonKho),
        tonKho: Number(tonHienTai) - Number(soLuongXuat),
        masterId,
        viTri,
      });
    }
    return list;
  };

  const handleAddProductToTable = (newProductList: ProductStoreExportInfo[]) => {
    const newProductList1 = newProductList.map((newProduct) => ({
      ...newProduct,
      tonHienTai: newProduct?.soLuong,
      thoiHanLuuKho: newProduct.ThoiHanLuuKho,
    }));
    setProductExportAddStoreDetails(newProductList1);
  };

  const updateNewDataArray = (newState: TableChangeState<ProductStoreExportInfo>) => {
    const {
      cellEdit: { dataField, newValue, rowId },
    } = newState;
    setProductExportAddStoreDetails((prevDataArray) =>
      prevDataArray.map((item) => ((item.id || '1') === rowId ? { ...item, [dataField]: newValue } : item)),
    );
  };

  const handleSaveConfirmClick = useCallback(
    (productStoreExportInfo: ProductStoreExportInfo) => {
      // Create new bill
      delete productStoreExportInfo.isChecked;
      createdProductExportBillMutateAsync({
        data: {
          ...productStoreExportInfo,
          maPhieu: productStoreExportInfo?.maPhieu || 'maPhieu',
          loaiPhieu: loaiPhieu || '0',
          details: normalizeProductDetails(productExportAddStoreDetails) || [],
        },
      })
        .then(() => {
          // Open save complete model
          toggleSaveCompleteModal();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [createdProductExportBillMutateAsync, loaiPhieu, productExportAddStoreDetails, toggleSaveCompleteModal],
  );

  const handleClosedCompletePopup = useCallback(() => {
    navigate(Page.PRODUCT_STORE_EXPORT_LIST.PATH);
  }, [navigate]);

  return {
    handleAddProductToTable,
    handleClosedCompletePopup,
    handleSaveConfirmClick,
    isOpenSaveCompleteModal,
    isValidProductDetails,
    loaiPhieu,
    navigate,
    productExportAddStoreDetails,
    setLoaiPhieu,
    toggleSaveCompleteModal,
    updateNewDataArray,
  };
};
