import {
  useKhotpTransPhieuXuatControllerFindById,
  useKhotpTransPhieuXuatControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-trans-phieu-xuat-controller/khotp-trans-phieu-xuat-controller';
import { KhotpTransPhieuXuatDetailWithRelations } from 'main/apis/drc/models';
import { Page } from 'main/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TableChangeState } from 'react-bootstrap-table-next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ProductStoreExportInfo } from '../product-store-export-add/use-product-store-export-add';

const infoInitialValues: ProductStoreExportInfo = {
  soXe: '',
  soChungTu: '',
  nguoiXuatHang: '',
  nguoiVanChuyen: '',
  ngayXuat: '',
  // ngayChungTu: '',
  maSoThueKh: '',
  maPhieu: '',
  maKhoXuat: '',
  maKhoNhap: '',
  maKh: '',
  loaiPhieu: '',
  hinhThucThanhToan: '',
  dtKh: '',
  diaChiKh: '',
};

export type ProductStoreExportInfoDetail = Omit<KhotpTransPhieuXuatDetailWithRelations, 'details'> & {
  typeAdd?: string;
  idNhap?: number | null;
};

export const useProductStoreExportEdit = () => {
  const { id: productExportBillId } = useParams();
  // React Router
  const navigate = useNavigate();

  const [isOpenSaveCompleteModal, setOpenSaveCompleteModal] = useState(false);
  const [productExportEditInfo, setProductExportEditInfo] = useState<ProductStoreExportInfo>(infoInitialValues);
  // const [loaiPhieu, setLoaiPhieu] = useState('');
  const [isChecked, setIsChecked] = useState(productExportEditInfo?.loaiPhieu === '1' ? true : false);

  const [productExportEditStoreDetails, setProductExportEditStoreDetails] = useState<
    KhotpTransPhieuXuatDetailWithRelations[]
  >([]);

  const isValidProductDetails = useMemo(() => {
    if (!productExportEditStoreDetails || productExportEditStoreDetails.length === 0) {
      return true;
    }

    return productExportEditStoreDetails?.every((detail) => detail.soLuongYc && detail.soLuongXuat);
  }, [productExportEditStoreDetails]);

  // React Query
  const { data: productExportBill, isLoading: productExportBillIsLoading } = useKhotpTransPhieuXuatControllerFindById(
    Number(productExportBillId),
    {
      query: {
        enabled: !!productExportBillId,
      },
    },
  );

  // React Query
  const { mutateAsync: updateProductImportBillMutateAsync } = useKhotpTransPhieuXuatControllerUpdateById();

  // React function
  // const toggleSaveModal = useCallback(() => setOpenSaveModal((isOpenSaveModal) => !isOpenSaveModal), []);

  const toggleSaveCompleteModal = useCallback(
    () => setOpenSaveCompleteModal((isOpenSaveCompleteModal) => !isOpenSaveCompleteModal),
    [],
  );

  const updateNewDataArray = (newState: TableChangeState<ProductStoreExportInfo>) => {
    const {
      cellEdit: { dataField, newValue, rowId },
    } = newState;
    setProductExportEditStoreDetails((prevDataArray) =>
      prevDataArray.map((item) => ((item.id || '1') === rowId ? { ...item, [dataField]: newValue } : item)),
    );
  };

  const normalizeProductDetails = (productDetails: ProductStoreExportInfoDetail[]) => {
    const list = [];
    const newListDetailsUpdate: ProductStoreExportInfoDetail[] = productDetails?.map((item) => {
      if (item.typeAdd === 'ADD') {
        const { id, masterId, typeAdd, ...rest } = item;
        return rest;
      }
      return item;
    });

    for (const productDetail of newListDetailsUpdate) {
      const {
        ghiChu,
        hanSd,
        id,
        idNhap,
        maPhieu,
        maSanPham,
        masterId,
        soLuongXuat,
        soLuongYc,
        thangSx,
        tonHienTai,
        // tonKho,
        // viTri,
      } = productDetail;
      list.push({
        id,
        idNhap,
        masterId,
        ghiChu,
        hanSd,
        maPhieu,
        maSanPham,
        soLuongXuat: Number(soLuongXuat),
        soLuongYc: Number(soLuongYc),
        thangSx,
        tonHienTai,
        tonKho: Number(tonHienTai) - Number(soLuongXuat),
        // viTri,
      });
    }

    return list;
  };

  const handleAddProductToTable = (newProductList: ProductStoreExportInfo[]) => {
    const newProductList1 = newProductList.map((newProduct) => ({
      ...newProduct,
      tonHienTai: newProduct?.soLuong,
      thoiHanLuuKho: newProduct.ThoiHanLuuKho,
      ngayXuat: newProduct?.ngayNhap,
      idNhap: newProduct.id,
    }));
    setProductExportEditStoreDetails(newProductList1);
  };

  const handleSaveConfirmClick = useCallback(
    (productStoreExportInfo: ProductStoreExportInfo) => {
      delete productStoreExportInfo?.isChecked;
      // Create new bill
      updateProductImportBillMutateAsync({
        data: {
          ...productStoreExportInfo,
          maPhieu: productStoreExportInfo?.maPhieu || 'maPhieu',
          loaiPhieu: isChecked ? '1' : '0',
          details: normalizeProductDetails(productExportEditStoreDetails) || [],
        },
        id: Number(productExportBillId),
      })
        .then(() => {
          toggleSaveCompleteModal();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [
      updateProductImportBillMutateAsync,
      isChecked,
      productExportEditStoreDetails,
      productExportBillId,
      toggleSaveCompleteModal,
    ],
  );

  const handleClosedCompletePopup = useCallback(() => {
    navigate(Page.PRODUCT_STORE_EXPORT_LIST.PATH);
  }, [navigate]);

  useEffect(() => {
    if (!productExportBillIsLoading && productExportBill) {
      const { details, ...filterSearch } = productExportBill;

      setProductExportEditStoreDetails(details || []);
      setProductExportEditInfo(filterSearch || {});
      setIsChecked(filterSearch.loaiPhieu === '1' ? true : false);
      // setLoaiPhieu(filterSearch.loaiPhieu || '');
    }
  }, [productExportBillIsLoading, productExportBill]);

  return {
    handleAddProductToTable,
    handleSaveConfirmClick,
    isOpenSaveCompleteModal,
    navigate,
    productExportBill,
    productExportEditInfo,
    productExportEditStoreDetails,
    // setLoaiPhieu,
    handleClosedCompletePopup,
    toggleSaveCompleteModal,
    updateNewDataArray,
    isValidProductDetails,
    setIsChecked,
    isChecked,
  };
};
