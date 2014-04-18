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

Template.barInterface.selectedYear = function() {
  calendarDep.depend();

  return selectedYear;
};

Template.barInterface.days = function() {
  if (typeof Meteor.user().prices === 'undefined') {
    return undefined;
  }

  calendarDep.depend();

  var date = new Date();
  var result = [];

  for (var i = 1; i <= daysInMonth(selectedYear, selectedMonth + 1); i++) {
    var day = { month: monthName(selectedMonth), number: i };

    var priceForDay = getPrice(selectedYear, selectedMonth, i);

    if (priceForDay !== undefined) { // Is there already a price defined for this day?
      day['price'] = priceForDay + '€';
    }

    if (i === selectedDay) { // Is this is the currently selected day?
      day['selected'] = 'selected';
    }

    if (i < date.getDate() ||
        selectedMonth < date.getMonth() ||
        selectedYear < date.getFullYear()) {
      day['old'] = 'old';
    }

    result.push(day);
  }

  return result;
};

Template.barInterface.userPrice = function() {
  calendarDep.depend();

  return getPrice(selectedYear, selectedMonth, selectedDay);
};


/* All the events for the calendar page */

Template.barInterface.events = {
  'click .day': function(event) {
    if (event.currentTarget.className.indexOf('old') === -1) {
      selectedDay = parseInt(event.currentTarget.innerText.split(' ')[1]);
      calendarDep.changed();
    }
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
