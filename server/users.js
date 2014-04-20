Accounts.onCreateUser(function(options, user) {
  user.prices = { };

  return user;
});

Meteor.methods({
  changePrice: function(hashedDate, newPrice) {
    /* Updates the beer price for date 'date' */

    var currentPrices = Meteor.user().prices;

    if (isNaN(newPrice)) {
      currentPrices[hashedDate] = Infinity;
    } else {
      currentPrices[hashedDate] = newPrice;
    }

    Meteor.users.update(
      { emails: Meteor.user().emails },
      { $set: { prices: currentPrices }}
    );

    return true;
  },

  /* Calculates cheapest bar */
  cheapest: function() {
    var date = new Date();
    var hashedDate = hashDate(date.getFullYear(), date.getMonth(), date.getDate());
    var allUsers = Meteor.users.find({ }).fetch();

    // Default undefineds to Infinity
    for (var i = 0; i < allUsers.length; i++) {
      if (allUsers[i].prices[hashedDate] === undefined) {
        allUsers[i].prices[hashedDate] = Infinity;
      }
    }

    allUsers.sort(function(a, b) {
      return a.prices[hashedDate] - b.prices[hashedDate];
    });

    var list = [];
    i = 0;
    while (i < allUsers.length &&
           allUsers[i].prices[hashedDate] == allUsers[0].prices[hashedDate]) {
      list.push(allUsers[i].emails[0].address);
      i++;
    }

    if (list.length == 0) {
      return undefined;
    }
    
    return { bars: list, price: allUsers[0].prices[hashedDate] };
  }
});
