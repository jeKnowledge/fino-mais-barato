var getPrice = function(year, month, day) {
  if (Meteor.user().prices === undefined) return undefined;

  return Meteor.user().prices[hashDate(year, month, day)];
};

var updateMonth = function(delta) {
  selectedMonth += delta;

  /* Handle overflows in year */
  
  if (selectedMonth == -1) {
    selectedMonth = 11;
    selectedYear--;
  } else if (selectedMonth == 12) {
    selectedMonth = 0;
    selectedYear++;
  }

  calendarDep.changed();
};

var calendarDep = new Deps.Dependency();

var selectedDay, selectedMonth, selectedYear;

Meteor.startup(function() {
  var date = new Date();

  selectedDay = date.getDate();
  selectedMonth = date.getMonth();
  selectedYear = date.getFullYear();
});

Deps.autorun(function() {
  Meteor.subscribe('ownUser');
});

Template.main.loggedIn = function() {
  return !! Meteor.user();
};

Template.main.selectedYear = function() {
  calendarDep.depend();
  
  return selectedYear;
};

Template.main.monthDays = function() {
  if (typeof Meteor.user().prices === 'undefined') {
    return undefined;
  }
  
  calendarDep.depend();

  var date = new Date();
  var currentMonthDay = date.getDate();
  var currentYear = date.getFullYear();
  var result = [];

  for (var i = 1; i <= daysInMonth(currentYear, selectedMonth + 1); i++) {
    var toPush = { name: monthName(selectedMonth), number: i,
                   price: getPrice(selectedYear, selectedMonth, i) + '€' };

    if (i === selectedDay) {
      toPush['selected'] = 'selected';
    }

    result.push(toPush);
  }

  return result;
};

Template.main.userPrice = function() {
  calendarDep.depend();

  return getPrice(selectedYear, selectedMonth, selectedDay);
};


/* All the events for the calendar page */

Template.main.events = {
  'click .month-day': function(event) {
    selectedDay = parseInt(event.currentTarget.innerText.split(' ')[1]);
    calendarDep.changed();
  },

  'click #new-price-button': function() {
    var date = monthName(selectedMonth) + ' ' + selectedDay;

    Meteor.call('changePrice', date, parseInt($('#new-price').val()));
  },

  'click #previous-month-button': function() {
    updateMonth(-1);
  },
  
  'click #next-month-button': function() {
    updateMonth(1);
  }
};
