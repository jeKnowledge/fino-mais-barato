/* List of all the month names, in Portugal */
monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
              'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

/* Generates the hash for a given date to be used in the database */
hashDate = function(year, month, day) {
  return year + ' ' + monthNames[month] + ' ' + day;
};
