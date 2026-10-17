import { DateFormat } from 'main/constants';
import { Moment } from 'moment';
import './index.css';
import ReactDatetimeClass, { DatetimepickerProps } from 'react-datetime';

interface Props extends DatetimepickerProps {
  hasCorrelationFromTo?: boolean;
  startDate?: Moment;
  endDate?: Moment;
}

function DatePicker(props: Props) {
  const { hasCorrelationFromTo, startDate, endDate, ...restProps } = props;

  return (
    <ReactDatetimeClass
      {...restProps}
      timeFormat={false}
      dateFormat={restProps.dateFormat || DateFormat.DATE_ONLY_VN}
      renderDay={
        hasCorrelationFromTo ? (props, currentDate, _) => renderDay(props, currentDate, startDate, endDate) : undefined
      }
    />
  );
}

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

const renderDay = (props: any, currentDate: any, startDate?: Moment, endDate?: Moment) => {
  let classes = props.className;
  classes += getClassNameDateDays(currentDate, startDate, endDate);
  return (
    <td {...props} className={classes}>
      {currentDate.date()}
    </td>
  );
};

export default DatePicker;
