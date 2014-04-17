var daysInMonth = function(year, month) {
  /* Returns the last day in month 'month' */

  return new Date(year, month, 0).getDate();
};

var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
              'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var getCurrentMonthString = function() {
  var date = new Date();
  return months[date.getMonth()];
};

var selectedDayDep = new Deps.Dependency();
var selectedDay;

Meteor.startup(function() {
  var date = new Date();

  selectedDay = date.getDate();
});

Template.main.loggedIn = function() {
  return !! Meteor.user();
};

Template.main.monthDays = function() {
  selectedDayDep.depend();

  var date = new Date();
  var currentMonthDay = date.getDate();
  var currentMonth = date.getMonth();
  var currentYear = date.getYear();
  var result = [];

  for (var i = 1; i <= daysInMonth(currentYear, currentMonth + 1); i++) {
    var toPush = { name: months[currentMonth], number: i };

    if (i === selectedDay) {
      toPush['selected'] = 'selected';
    }

    result.push(toPush);
  }

  return result;
};

Template.main.userPrice = function() {
  selectedDayDep.depend();

  if (typeof Meteor.user().prices !== 'undefined') {
    return Meteor.user().prices[getCurrentMonthString() + ' ' + selectedDay];
  }
};

Template.main.events = {
  'click .month-day': function(event) {
    selectedDay = parseInt(event.currentTarget.innerText.split(' ')[1]);
    selectedDayDep.changed();
  },

  'click #new-price-button': function() {
    var date = getCurrentMonthString() + ' ' + selectedDay;

    Meteor.call('changePrice', date, parseInt($('#new-price').val()));
  }
};

Deps.autorun(function() {
  Meteor.subscribe('ownUser');
});
