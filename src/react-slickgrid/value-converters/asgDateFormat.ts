import moment from 'moment-mini';

export class AsgDateFormatValueConverter {
  static toView(value: any, format: string): string {
    return moment(value).format(format);
  }
}
