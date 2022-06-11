export const useUnitCommaData = (currency: boolean, calc: number | string) => {
  return currency
    ? `$${calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : `₩${calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
