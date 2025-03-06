const isToday = (date: Date | string): boolean => {
  const today = new Date().setHours(0, 0, 0, 0);
  const compareDate = new Date(date).setHours(0, 0, 0, 0);

  return today === compareDate;
};

export default isToday;
