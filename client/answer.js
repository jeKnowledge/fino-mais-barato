var bar;
var price;

var answerDep = new Deps.Dependency();

Template.answer.rendered = function() {
  Meteor.call('cheapest', function(error, response) {
    answerDep.changed();

    bar = response.bar;
    price = response.price;
  });
};

Template.answer.bar = function() {
  answerDep.depend();

  return bar;
};

Template.answer.price = function() {
  answerDep.depend();

  return price;
};
