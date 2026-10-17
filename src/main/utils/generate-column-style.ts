import { Color } from 'main/constants';

export const generateColumnStyle = (width?: string, isDisable?: boolean) => {
  const disableStyle = isDisable
    ? {
        backgroundColor: Color.LIGHT_GRAY,
      }
    : {};
  const widthStyle = width ? { width, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' } : {};
  return {
    headerStyle: {
      ...widthStyle,
    },
    style: {
      ...widthStyle,
      ...disableStyle,
    },
  };
};
