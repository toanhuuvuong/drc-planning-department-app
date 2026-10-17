import { BasicSpinner } from 'main/components/atoms/spiner';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useProductStoreLocationOptions } from 'main/hooks';
import { ChangeEvent } from 'react';

type Props = {
  editorProps: any;
  value: string;
  productStoreCode?: string | null;
};

function ProductStoreLocationCell({ editorProps, value, productStoreCode }: Props) {
  // React State
  const { productStoreLocationOptions, productStoreLocationsIsLoading } = useProductStoreLocationOptions(
    false,
    productStoreCode,
  );

  if (productStoreLocationsIsLoading) {
    return <BasicSpinner />;
  }

  return (
    <Select2Box
      className="form-control"
      options={{ placeholder: 'Chọn vị trí' }}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => editorProps.onUpdate(e.target.value)}
      data={productStoreLocationOptions}
    />
  );
}

export default ProductStoreLocationCell;
