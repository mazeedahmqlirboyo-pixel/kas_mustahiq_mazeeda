export const JAUSYAN_PERIODS = [
  "Syawal",
  "Dzul Qo'dah",
  "Dzul Hijjah",
  "Muharram",
  "Shofar",
  "Robi'ul Awal",
  "Robi'ul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rojab",
  "Sya'ban",
  "Romadhon"
];

// Helper untuk format Rupiah
export const formatRupiah = (number) => {
  if (number === undefined || number === null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Helper untuk parse input string rupiah kembali ke number
export const parseRupiah = (rupiahString) => {
  if (!rupiahString) return 0;
  const numParams = rupiahString.replace(/[^0-9]/g, "");
  return parseInt(numParams, 10) || 0;
};
