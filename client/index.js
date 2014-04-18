Deps.autorun(function() {
  Meteor.subscribe('ownUser');
});

Template.index.loggedIn = function() {
  return !! Meteor.user();
};
