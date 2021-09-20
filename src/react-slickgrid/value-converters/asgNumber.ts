export class AsgNumberValueConverter {
  static fromView(value: any): number {
    const number = parseFloat(value);
    return isNaN(number) ? value : number;
  }
}
