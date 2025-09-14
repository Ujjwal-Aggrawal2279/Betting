export const getTimeFromISOString = (iso) => {
  if (!iso) return "-";
  return iso.slice(11, 16); 
};
