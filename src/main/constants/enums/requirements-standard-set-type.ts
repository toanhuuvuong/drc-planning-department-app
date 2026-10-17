const RequirementsStandardSetType = {
  'luyen-bias': { id: 'luyen-bias', text: 'Luyện Bias' },
  'luyen-radial': { id: 'luyen-radial', text: 'Luyện Radial' },
  tbb: { id: 'tbb', text: 'TBB' },
  'tbr-without-sam': { id: 'tbr-without-sam', text: 'TBR ko săm' },
  'tbr-sam': { id: 'tbr-sam', text: 'TBR có săm' },
  'dplus-atv': { id: 'dplus-atv', text: 'DPLUS-ATV' },
  xdxm: { id: 'xdxm', text: 'XDXM' },
  'ltr-prc-lt-10000c': { id: 'ltr-prc-lt-10000c', text: 'LTR_PCR SL<10.000c' },
  'ltr-prc-gt-1000c': { id: 'ltr-prc-gt-1000c', text: 'LTR_PRC SL>10.00c' },
  sm: { id: 'sm', text: 'SM' },
  'ibd-od-yem': { id: 'ibd-od-yem', text: 'IBD-OD.YEM' },
  dng: { id: 'dng', text: 'DNg' },
};

export const getRequirementsStandardSetTypeByText = (text: string) => {
  for (const key in RequirementsStandardSetType) {
    const item = RequirementsStandardSetType[key as keyof typeof RequirementsStandardSetType];
    if (item.text === text) {
      return item;
    }
  }
  return null;
};

export default RequirementsStandardSetType;
