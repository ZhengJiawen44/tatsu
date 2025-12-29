export const CustomDayWrapper = ({ children, value }) => {
  // value is the Date for the cell
  const isWeekend = value.getDay() === 0 || value.getDay() === 6;
  return <div className={isWeekend ? "bg-red-50" : "bg-red"}>{children}</div>;
};
