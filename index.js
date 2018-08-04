const d3 = require('d3');
const _ = require('lodash');

var perHour = function(data, newDate, keyName, name, accessFunction) {
  var h;
  return {
    "key": newDate,
    "name": name,
    "values": (function() {
      var i, results1;
      results1 = [];
      for (h = i = 0; i <= 23; h = ++i) {
        results1.push(nestHour(h, newDate, data, keyName, accessFunction));
      }
      return results1;
    })()
  };
};
const nestHour = function(h, newDate, data, valueKey, valueFn) {
  if (!valueFn) {
    valueFn = function(d) { return d[valueKey]; };
  }
  const hourDate = d3.timeHour.offset(newDate, h);
  entry = _.find(data, function(d) { return parseInt(d.hour) == h});
  return {
    "key": hourDate,
    "value": entry ? valueFn(entry) : 0,
    "name": valueKey
  }
};
module.exports = {
  perHour: perHour
}
/**
var newDate = new Date(2016,0,1,0)
data = perHour(rawData, newDate, "accidents", "Colissions");
**/
