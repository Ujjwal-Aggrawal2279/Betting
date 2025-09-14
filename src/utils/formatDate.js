export const getTimeFromISTString = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const hours = d.getUTCHours().toString().padStart(2, "0");
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  console.log(hours, minutes)
  return `${hours}:${minutes}`;
};
