import { useKhovtMasterKhoControllerFind } from 'main/apis/drc/endpoints/khovt-master-kho-controller/khovt-master-kho-controller';
import BasicTemplate from 'main/components/templates/basic-template/basic-template';

function SuppliesCategoryEdit() {
  const { data, isLoading } = useKhovtMasterKhoControllerFind({
    filter: {
      offset: 0,
      limit: 100,
      skip: 0,
      where: {
        additionalProp1: {},
      },
      fields: {
        ghiChu: true,
        id: true,
        maKho: true,
        tenKho: true,
      },
    },
  });

  if (!isLoading) {
    console.log(data);
  }

  return <BasicTemplate pageTitle="aaa" pageName="aaa" isLoading={isLoading}></BasicTemplate>;
}

export default SuppliesCategoryEdit;
