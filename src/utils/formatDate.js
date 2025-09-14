export const getTimeFromISTString = (iso) => {
  if (!iso) return "-";

  const d = new Date(iso);

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata", // ✅ Force IST
  }).format(d);
};
