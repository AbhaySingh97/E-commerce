const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-IN');

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

export const formatNumber = (value) => numberFormatter.format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return '-';
  return dateFormatter.format(new Date(value));
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  return dateTimeFormatter.format(new Date(value));
};

export const formatOrderStatus = (value) => {
  if (!value) return 'Unknown';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const percentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};
