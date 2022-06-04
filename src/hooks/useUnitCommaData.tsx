export const useUnitCommaData = (currency: boolean, calc: number) => {
  return currency
    ? `$${calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : `₩${calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
