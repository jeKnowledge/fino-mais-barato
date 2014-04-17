Accounts.onCreateUser(function(options, user) {
  user.prices = { };

  return user;
});

Meteor.methods({
  changePrice: function(date, newPrice) {
    /* Updates the beer price for date 'date' */

    var currentPrices = Meteor.user().prices;
    currentPrices[date] = newPrice;

    Meteor.users.update(
      { emails: Meteor.user().emails },
      { $set: { prices: currentPrices }}
    );

    return true;
  }
});
