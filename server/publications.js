Meteor.publish('ownUser', function() {
  return Meteor.users.find(this.userId, { fields: { prices: true } });
});
