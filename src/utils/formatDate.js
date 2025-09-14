export const getTimeFromISTString = (iso) => {
  if (!iso) return "-";
  const localDate = new Date(iso);
  const hours = localDate.getHours().toString().padStart(2, "0");
  const minutes = localDate.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
