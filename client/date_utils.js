/* List of all the month names, in Portugal */
var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
                  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

/* Returns the last day in month 'month' */
daysInMonth = function(year, month) {
  return new Date(year, month, 0).getDate();
};

/* Generates the hash for a given date to be used in the database */
hashDate = function(year, month, day) {
  return monthNames[month] + ' ' + day;
};

/* Get string name for a given month */
monthName = function(month) {
  return monthNames[month];
};
