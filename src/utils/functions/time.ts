export const unixToTimeHM = ({unix}: {unix: number}) => {
  const date = new Date(unix * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (isNaN(hours)) return '';

  return `${hours}:${minutes}`;
};
