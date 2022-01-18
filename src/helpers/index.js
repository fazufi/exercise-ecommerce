export const API_URL = process.env.REACT_APP_API_URL
export const formatter = new Intl.NumberFormat("id-ID", {
  style: 'currency',
  currency: 'IDR'
}).format;
