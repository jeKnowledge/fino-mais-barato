if (Meteor.isClient) {
  Template.main.events({ });
}

if (Meteor.isServer) {
  Meteor.startup(function () { });
}
