var https = require('https');

var sdConsumerKey = 'YOUR_KEY_HERE';
var gnClientId = '';
var gnUserId = '';

if (!sdConsumerKey || !gnClientId || !gnUserId) {
  console.error("Test not configured!");
  process.exit(1);
}

var sdOptions = {
  host: 'api.7digital.com',
  path: '/1.2/status?oauth_consumer_key=' + sdConsumerKey
};

var gnOptions = {
  host: 'c' + gnClientId.split('-')[0] + '.web.cddbp.net',
  path: '/webapi/json/1.0/fieldvalues?client=' + gnClientId + '&fieldname=RADIOMOOD&user=' + gnUserId
};

request('7digital', sdOptions, function() {
  request('Gracenote', gnOptions);
});

function request(apiName, options, onEndCallback) {
  console.info('--- Requesting ' + apiName + ' ------------------------------------------------');
  console.info('URL: https://' + options.host + options.path);
  console.info(options);
  var req = https.request(options, function(res) {
    processResponse(res, function() {
      console.info('--- ' + apiName + ' test completed successfully ------------------------------');
      console.info('');
      if (onEndCallback) {
        onEndCallback();
      }
    });
  });
  req.end();
}

function processResponse(response, onEnd) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    console.info(str);
    onEnd();
  });
}