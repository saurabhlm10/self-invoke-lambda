import { ENV } from "../constants";

export const getCurrentMonthYearName = (): string => {
  const currentDate = new Date();
  const currentMonthYearName = `${
    ENV.months[currentDate.getMonth()]
  }-${currentDate.getFullYear()}`;

  return currentMonthYearName;
};
