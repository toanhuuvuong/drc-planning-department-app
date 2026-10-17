import { QdhdsdMasterTaiLieu } from 'main/apis/drc/models';
import DocumentViewerTemplate from 'main/components/templates/document-viewer-template';
import Endpoint from 'main/configs/endpoints';
import { useMemo } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  document?: QdhdsdMasterTaiLieu;
};

function ViewDocumentModal({ isOpen, toggle, document }: Props) {
  // React State
  const { urlTaiLieu, extensionTaiLieu } = useMemo(() => {
    let urlTaiLieu = document?.urlTaiLieu || '';
    const extensionTaiLieu = document?.urlTaiLieu?.split('.')?.at(-1);

    // Check if external url
    if (!urlTaiLieu.startsWith('https:') && !urlTaiLieu.startsWith('http:')) {
      urlTaiLieu = `${Endpoint.DrcApiBaseUrl}/${urlTaiLieu}`;
    }

    return { urlTaiLieu, extensionTaiLieu };
  }, [document?.urlTaiLieu]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader toggle={toggle}>{document?.tenTaiLieu}</ModalHeader>
      <ModalBody>
        <DocumentViewerTemplate documentUri={urlTaiLieu} documentFileType={extensionTaiLieu} height={400} />
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ViewDocumentModal;
