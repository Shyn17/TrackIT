export const formatDate = (date) =>
  new Date(date).toLocaleDateString();

export const truncate = (text, len = 50) =>
  text.length > len ? text.substring(0, len) + "..." : text;