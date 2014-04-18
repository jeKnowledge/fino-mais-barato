var getPrice = function(year, month, day) {
  if (Meteor.user().prices === undefined) return undefined;

  var price = Meteor.user().prices[hashDate(year, month, day)];

  if (price === Infinity) {
    return undefined;
  } else {
    return price;
  }
};

var updateMonth = function(delta) {
  selection.month += delta;

  /* Handle overflows in year */

  if (selection.month == -1) {
    selection.month = 11;
    selection.year--;
  } else if (selection.month == 12) {
    selection.month = 0;
    selection.year++;
  }

  calendarDep.changed();
};

var calendarDep = new Deps.Dependency();

var selection = { }; // selection.day, selection.month, selection.year

Meteor.startup(function() {
  var date = new Date();

  selection.day = date.getDate();
  selection.month = date.getMonth();
  selection.year = date.getFullYear();
});

Template.barInterface.selectedYear = function() {
  calendarDep.depend();

  return selection.year;
};

Template.barInterface.days = function() {
  if (typeof Meteor.user().prices === 'undefined') {
    return undefined;
  }

  calendarDep.depend();

  var date = new Date();
  var result = [];

  for (var i = 1; i <= daysInMonth(selection.year, selection.month + 1); i++) {
    var day = { month: monthName(selection.month), number: i };

    var priceForDay = getPrice(selection.year, selection.month, i);

    if (priceForDay !== undefined) { // Is there already a price defined for this day?
      day['price'] = priceForDay;
    }

    if (i === selection.day) { // Is this is the currently selected day?
      day['selected'] = 'selected';
    }

    if (i < date.getDate() &&
        selection.month === date.getMonth() &&
        selection.year === date.getFullYear() ||
       selection.month < date.getMonth() || selection.year < date.getFullYear()) {
      day['old'] = 'old';
    }

    result.push(day);
  }

  return result;
};

Template.barInterface.userPrice = function() {
  calendarDep.depend();

  return getPrice(selection.year, selection.month, selection.day);
};


/* All the events for the calendar page */

Template.barInterface.events = {
  'click .day': function(event) {
    if (event.currentTarget.parentNode.className.indexOf('old') === -1) {
      selection.day = Number(event.currentTarget.innerText.split(' ')[1]);
      calendarDep.changed();
    }
  },

  'click #new-price-button': function() {
    var hashedDate = hashDate(selection.year, selection.month, selection.day);
    var newPrice = Number($('#new-price').val().replace(',', '.'));

    Meteor.call('changePrice', hashedDate, newPrice);
  },

  'click #previous-month-button': function() {
    updateMonth(-1);
  },

  'click #next-month-button': function() {
    updateMonth(1);
  }
};
