import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { PropsWithChildren } from 'react';

export default function EditPermissionAction({ children }: Readonly<PropsWithChildren<{}>>) {
  const isShow = usePermissionAction();
  return <>{isShow && children}</>;
}
