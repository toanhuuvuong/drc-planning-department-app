import { DateFormat } from 'main/constants';
import moment, { Moment } from 'moment';

const DateUtil = {
  toISOString(date: moment.MomentInput | undefined, defaultValue?: string) {
    return date ? moment(date).utc(true).toISOString() : defaultValue;
  },
  toDateISOString(date: moment.MomentInput | undefined, isMuiDate?: boolean, defaultValue?: string) {
    if (!date) {
      return defaultValue;
    }
    if (isMuiDate) {
      return moment(date, DateFormat.DATE_ONLY_VN).utc(true).format(DateFormat.ISO_8601_DATE_ONLY);
    }
    return moment(date).utc(true).format(DateFormat.ISO_8601_DATE_ONLY); // date only & ignore UTC
  },
  toDate(date: Moment | undefined, defaultValue?: Date) {
    return date ? date.toDate() : defaultValue;
  },
  createDateWithDayOfMonth(dayOfMonth: number) {
    const currentDate = moment();
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    return currentDate.year(currentYear).month(currentMonth).date(dayOfMonth);
  },
};

export default DateUtil;
