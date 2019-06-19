const eletricityFormatter = electricity => {
  const id = 3;
  const { produced, consumed, ratio } = electricity;
  const name = 'Electricity';

  return {
    id,
    name,
    netAmount: null,
    currentPercent: parseFloat(ratio).toFixed(4),
    consumed: parseFloat(consumed).toFixed(2),
    produced: parseFloat(produced).toFixed(2),
    consumedRate: parseFloat(consumed).toFixed(2),
    producedRate: parseFloat(produced).toFixed(2),
  };
};
export default eletricityFormatter;
