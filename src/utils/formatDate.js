export const getTimeFromISTString = (iso) => {
  if (!iso) return "-";
  return iso.slice(11, 16); 
};
