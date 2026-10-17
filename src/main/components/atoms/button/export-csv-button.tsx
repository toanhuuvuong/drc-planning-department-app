import { PropsWithChildren } from 'react';
import { Button } from 'reactstrap';

type Props = {
  color?: string;
  onExport: () => void;
};

function ExportCSVButton({ children, color, onExport }: PropsWithChildren<Props>) {
  const handleClick = () => {
    onExport();
  };

  return (
    <Button color={color || 'primary'} onClick={handleClick}>
      {children}
    </Button>
  );
}

export default ExportCSVButton;
