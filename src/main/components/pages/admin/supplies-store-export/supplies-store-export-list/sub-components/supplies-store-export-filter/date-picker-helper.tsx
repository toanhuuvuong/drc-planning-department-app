import { Moment } from 'moment';

const getClassNameDateDays = function (currentDate: Moment, startDate?: Moment, endDate?: Moment) {
  if (startDate && endDate && startDate.toDate() + '' !== endDate.toDate() + '') {
    if (endDate.toDate() > currentDate.toDate() && startDate.toDate() < currentDate.toDate()) {
      return ' middle-date';
    }
    if (endDate.toDate() + '' === currentDate.toDate() + '') {
      return ' end-date';
    }
    if (startDate.toDate() + '' === currentDate.toDate() + '') {
      return ' start-date';
    }
  }
  return '';
};

const DatePickerHelper = {
  renderDay(props: any, currentDate: any, startDate?: Moment, endDate?: Moment) {
    let classes = props.className;
    classes += getClassNameDateDays(currentDate, startDate, endDate);
    return (
      <td {...props} className={classes}>
        {currentDate.date()}
      </td>
    );
  },
};

export default DatePickerHelper;
