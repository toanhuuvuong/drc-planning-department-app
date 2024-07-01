import { getSuppliesCategoryMock } from 'main/apis/custom/supplies-category/supplies-category.msw';
import { getKhovtMasterKhoControllerMock } from 'main/apis/drc/endpoints/khovt-master-kho-controller/khovt-master-kho-controller.msw';
import { getKhovtMasterNguonGocControllerMock } from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller.msw';
import { getKhovtMasterVtControllerMock } from 'main/apis/drc/endpoints/khovt-master-vt-controller/khovt-master-vt-controller.msw';
import { getKhovtNhomControllerMock } from 'main/apis/drc/endpoints/khovt-nhom-controller/khovt-nhom-controller.msw';
import { getKhovtTransPhieuXuatControllerMock } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller.msw';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(
  ...getSuppliesCategoryMock(),
  ...getKhovtTransPhieuXuatControllerMock(),
  ...getKhovtMasterKhoControllerMock(),
  ...getKhovtNhomControllerMock(),
  ...getKhovtMasterVtControllerMock(),
  ...getKhovtMasterNguonGocControllerMock(),
);
