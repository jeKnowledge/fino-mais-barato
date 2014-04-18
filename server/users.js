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
    
    return { bar: allUsers[0].emails[0].address, price: allUsers[0].prices[hashedDate] };
  }
});
