import Select2 from 'react-select2-wrapper';
import styled from 'styled-components';

function Select2Box(props: any) {
  const { invalid, ...select2Props } = props;
  return (
    <Select2Wrapper invalid={invalid}>
      <Select2 {...select2Props} />
    </Select2Wrapper>
  );
}

type Select2WrapperProps = {
  invalid?: boolean;
};

const Select2Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'invalid', // Lọc 'invalid', vì nó không phải attribute của thẻ <div>
})<Select2WrapperProps>`
  .select2-selection {
    font-size: 0.875rem;
    height: calc(1.5em + 1.25rem + 5px);
    ${(props) => (props.invalid ? 'border-color: #fb6340;' : '')}

    .select2-selection__placeholder {
      color: #8898aa;
      opacity: 0.8;
    }
  }

  .select2-container--default .select2-selection--multiple .select2-selection__choice {
    display: inline-flex;
    padding: 0 0.5rem 0 1.25rem;
    margin: 0 0 0.25rem 0.25rem;
    background-color: #dfefff;
    border: none;
    border-radius: 0.25rem;
    line-height: 1.5rem;
    font-size: 0.875rem;
    color: #8898aa;
  }

  .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
    order: 2;
    margin-left: 0rem;
    color: #8898aa;
  }
`;

export default Select2Box;
