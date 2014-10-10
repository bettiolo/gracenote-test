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
  host: 'c4711424.web.cddbp.net',
  path: '/webapi/json/1.0/fieldvalues?client=' + gnClientId + '&fieldname=RADIOMOOD&user=' + gnUserId
};

request7d();

function request7d() {
  console.info('--- Requesting 7digital ------------------------------');
  console.info('URL: https://' + sdOptions.host + sdOptions.path);
  console.info(sdOptions);
  var req = https.request(sdOptions, function(res) {
    processResponse(res, function() {
      console.info('');
      requestGn();
    });
  });
  req.end();
}

function requestGn() {
  console.info('--- Requesting Gracenote ------------------------------');
  console.info('URL: https://' + gnOptions.host + gnOptions.path);
  console.info(gnOptions);
  var req = https.request(gnOptions, function(res) {
    processResponse(res, function() {
      console.info('--- Test completed successfully ------------------------------');
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