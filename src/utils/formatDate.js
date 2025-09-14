export const getTimeFromISTString = (iso) => {
  if (!iso) return "-";
  console.log(iso.slice(11, 16))
  return iso.slice(11, 16); 
};
