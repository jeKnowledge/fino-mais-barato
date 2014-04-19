var bars = [];
var price;

var answerDep = new Deps.Dependency();

Template.answer.rendered = function() {
  Meteor.call('cheapest', function(error, response) {
    answerDep.changed();

    price = response[0].price;
    for(var i = 0; i < response.length; i++){
    	bars.push(response[i].bar);
    }
  });
};

Template.answer.bar = function() {
  answerDep.depend();

  return bars;
};

Template.answer.price = function() {
  answerDep.depend();

  return price;
};
