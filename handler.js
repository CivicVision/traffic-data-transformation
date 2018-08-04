'use strict';

var AWS = require('aws-sdk');

var s3 = new AWS.S3();
const d3 = require('d3');
const { getCsv } = require('remote-csv');

const { perHour } = require('./index');

const saveHourData = function(url, keyName, fileName, accessFunction) {
  const rawData = getCsv(url).then(function(rawData) {
    const date = new Date(2016,0,1,0);
    const data = perHour(rawData, date, keyName, 'Data', accessFunction);
    const csvData = d3.csvFormat(data.values);
    console.log(csvData)
    saveToS3('traffic-sd', fileName, csvData);
  })
};

const saveToS3 = function(bucket, fileName, data) {
  const params = { Bucket: bucket, Key: fileName, Body: data };
  s3.putObject(params, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");
    }
  });
};

const hourData = (event, context, callback) => {
  saveHourData(event['url'], event['key'], event['fileName']);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'saved successfully',
      input: event,
    }),
  };

  callback(null, response);

};

const injuredPerAccidents = (event, context, callback) => {
  const accessFunction = function(d) {
    return (parseInt(d.accidents_injured)/parseInt(d.accidents))
  };
  saveHourData(event['url'], event['key'], event['fileName'], accessFunction);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'saved successfully',
      input: event,
    }),
  };

  callback(null, response);
};
module.exports = {
  hourData: hourData,
  injuredPerAccidents: injuredPerAccidents
}
