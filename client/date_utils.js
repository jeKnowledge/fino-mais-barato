/* Returns the last day in month 'month' */
daysInMonth = function(year, month) {
  return new Date(year, month, 0).getDate();
};

/* Get string name for a given month */
monthName = function(month) {
  return monthNames[month];
};
