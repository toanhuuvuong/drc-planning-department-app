import { Spinner } from 'reactstrap';
import styled from 'styled-components';

function TransparentSpinner() {
  return (
    <TransparentWrapper>
      <Spinner />
    </TransparentWrapper>
  );
}

const TransparentWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure it sits on top of other content */
`;

export default TransparentSpinner;
