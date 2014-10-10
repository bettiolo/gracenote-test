var https = require('https');

var sdConsumerKey = 'YOUR_KEY_HERE';
var gnClientId = '';
var gnUserId = '';

if (!sdConsumerKey || !gnClientId || !gnUserId) {
  console.log("Test not configured!");
  process.exit(1);
}

var sdOptions = {
  host: 'api.7digital.com',
  path: '/1.2/status?oauth_consumer_key=' + sdConsumerKey
};

var gnOptions = {
  host: 'c15270144.web.cddbp.net',
  path: '/webapi/json/1.0/fieldvalues?client=' + gnClientId + '&fieldname=RADIOMOOD&user=' + gnUserId
};

request7d();

function request7d() {
  console.log('--- Requesting 7digital ------------------------------');
  console.log('URL: https://' + sdOptions.host + sdOptions.path);
  console.log(sdOptions);
  var req = https.request(sdOptions, function(res) {
    processResponse(res, function() {
      console.log('');
      requestGn();
    });
  });
  req.end();
}

function requestGn() {
  console.log('--- Requesting Gracenote ------------------------------');
  console.log('URL: https://' + gnOptions.host + gnOptions.path);
  console.log(gnOptions);
  var req = https.request(gnOptions, function(res) {
    processResponse(res, function() {
      console.log('');
      console.log('--- Here we go again ------------------------------');
      request7d();
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
    console.log(str);
    onEnd();
  });
}