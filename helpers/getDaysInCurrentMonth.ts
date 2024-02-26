export function getDaysInCurrentMonth() {
  // Get the current date
  const now = new Date();

  // Get the current year
  const year = now.getFullYear();

  // Get the current month
  const month = now.getMonth();

  // Get the first day of the next month
  const firstDayOfNextMonth = new Date(year, month + 1, 1);

  // Subtract one day (in milliseconds) to get the last day of the current month
  const lastDayOfCurrentMonth = new Date(
    firstDayOfNextMonth.getTime() - 24 * 60 * 60 * 1000
  );

  // Get the number of days in the current month
  const numberOfDays = lastDayOfCurrentMonth.getDate();

  return numberOfDays;
}
