var bars = [];
var price;

var answerDep = new Deps.Dependency();

Template.answer.rendered = function() {
  Meteor.call('cheapest', function(error, response) {
    answerDep.changed();

    price = response.price;
    bars = response.bars;
  });
};

Template.answer.bars = function() {
  answerDep.depend();

  return bars;
};

Template.answer.price = function() {
  answerDep.depend();

  return price;
};
