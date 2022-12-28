import { formatInTimeZone } from 'date-fns-tz';
 
export class Util {
  static formatLocalDate(date: Date): string {
    return formatInTimeZone(date, process.env.TZ, 'yyyy-MM-dd HH:mm');
  }
}
