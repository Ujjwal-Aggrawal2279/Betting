export const getTimeFromISTString = (iso) => {
  if (!iso) return "-";
  const dateObj = new Date(iso);
  const hours = dateObj.getUTCHours().toString().padStart(2, "0");
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
