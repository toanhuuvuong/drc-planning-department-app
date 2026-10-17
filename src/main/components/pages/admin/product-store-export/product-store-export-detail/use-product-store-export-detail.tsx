import {
  useKhotpTransPhieuXuatControllerFindById,
  useKhotpTransPhieuXuatControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-trans-phieu-xuat-controller/khotp-trans-phieu-xuat-controller';
import { KhotpTransPhieuXuatDetailWithRelations } from 'main/apis/drc/models';
import { ExportStatus } from 'main/constants/enums';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useProductStoreExportDetail = () => {
  const { id: productExportBillId } = useParams();
  const navigate = useNavigate();

  const [productStoreExportDetails, setProductStoreExportDetails] = useState<KhotpTransPhieuXuatDetailWithRelations[]>(
    [],
  );
  const handleProductTableChange = (newProductList: KhotpTransPhieuXuatDetailWithRelations[]) => {
    setProductStoreExportDetails(newProductList);
  };
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);

  const {
    data: productExportBill,
    isLoading: productExportBillIsLoading,
    refetch: productExportBillRefetch,
  } = useKhotpTransPhieuXuatControllerFindById(Number(productExportBillId), {
    query: {
      enabled: !!productExportBillId,
    },
  });

  const { isPending: updatedProductExportBillIsPending, mutateAsync: updatedProductExportBillMutateAsync } =
    useKhotpTransPhieuXuatControllerUpdateById();

  const toggleCancelModal = () => setOpenCancelModal(!isOpenCancelModal);

  const handleCancelModalConfirmClick = async () => {
    toggleCancelModal();

    toggleCancelModal();
    updatedProductExportBillMutateAsync({
      id: Number(productExportBillId),
      data: {
        maPhieu: ExportStatus.Canceled.id,
        details: [],
      },
    })
      .then((_) => {
        productExportBillRefetch();
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  };

  return {
    navigate,
    productExportBillId,
    productExportBill,
    productExportBillIsLoading,
    updatedProductExportBillIsPending,
    isOpenCancelModal,
    productStoreExportDetails,
    handleProductTableChange,
    toggleCancelModal,
    handleCancelModalConfirmClick,
  };
};
