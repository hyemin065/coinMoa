export const useUnitCommaData = (current: boolean, calc: number) => {
  return current
    ? `$${calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : `₩${calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
