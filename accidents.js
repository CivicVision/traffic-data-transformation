const d3 = require('d3');
const d3Node = require('d3-node');
const dayofWeekChart = require('./dow-node');
const _ = require('lodash');
const fs = require('fs');

var accidentsPerHour = function(data, newDate) {
  var h;
  var accidents = function(d) {
    return parseInt(d.accidents);
  }
  return {
    "key": newDate,
    "name": "Collissions",
    "values": (function() {
      var i, results1;
      results1 = [];
      for (h = i = 0; i <= 23; h = ++i) {
        results1.push(nestHour(h, newDate, data, "accidents", accidents));
      }
      return results1;
    })()
  };
};
nestHour = function(h, newDate, data, valueKey, valueFn) {
  if (!valueFn) {
    valueFn = function(d) { return d[valueKey]; };
  }
  hourDate = d3.timeHour.offset(newDate, h);
  entry = _.find(data, function(d) { return parseInt(d.hour) == h});
  return {
    "key": hourDate,
    "value": entry ? valueFn(entry) : 0,
    "name": valueKey
  }
};

module.exports.generate = function (rawData) {
    var dowChartAccidents;
    var newDate = new Date(2016,0,1,0)
    data = [accidentsPerHour(rawData, newDate)];

    maxAccidents = d3.max(rawData, function(d) {
      return parseInt(d.accidents);
    });
    yValue = function(d) { return d.name; };

    dowChartAccidents = dayofWeekChart().valueKey("accidents").startDate(new Date(2016, 0, 1)).colorDomain([0, maxAccidents]).yValue(yValue);
    const d3n = new d3Node({selector: '#chart', container: '<div id="container"><div id="chart"></div></div>'});
    var svg = d3n.createSVG(700, 20);
    d3.select(d3n.document.querySelector('#chart')).data([data]).call(dowChartAccidents);
    return d3n;
};
