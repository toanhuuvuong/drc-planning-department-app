import moment from 'moment';

export const cellDateFormatter = (format: string) => {
  return (cell: string, _: any) => {
    if (!cell) {
      return null;
    }

    return <div>{moment(cell).format(format)}</div>;
  };
};
