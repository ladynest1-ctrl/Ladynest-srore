export const SITE_EMAIL = "Ladynest1@gmail.com";

export const SITE_CONTACT = {
  email: SITE_EMAIL,
  phone: "+92 321 4453830",
  location: "Lahore, Pakistan",
};

export function formatCurrency(amount) {
  const numericAmount = Number(amount) || 0;
  return `Rs. ${numericAmount.toLocaleString()}`;
}
