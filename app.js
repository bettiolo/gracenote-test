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
  headers: {
    host: 'c' + gnClientId.split('-')[0] + '.web.cddbp.net'
  },
  path: '/webapi/json/1.0/fieldvalues?client=' + gnClientId + '&fieldname=RADIOMOOD&user=' + gnUserId
};

request('7digital', sdOptions, function() {
  gnOptions.host = '96.46.150.32';
  request('Gracenote ' + gnOptions.host, gnOptions, function() {
    gnOptions.host = '208.72.242.176';
    request('Gracenote ' + gnOptions.host, gnOptions, function() {
      gnOptions.host = '209.10.42.47';
      request('Gracenote ' + gnOptions.host, gnOptions);
    });
  });
});

function request(apiName, options, onEndCallback) {
  console.info('--- Requesting ' + apiName + ' ---');
  // console.info('URL: https://' + options.host + options.path);
  // console.info(options);
  var req = https.request(options, function(res) {
    processResponse(res, function() {
      console.info('✓✓✓ ' + apiName + ' request successful ✓✓✓');
      console.info('');
      if (onEndCallback) {
        onEndCallback();
      }
    });
  });
  req.on('error', function (err) {
    // console.error(err);
    console.error('!!! ' + apiName + ' ERROR !!!');
    console.info('');
    if (onEndCallback) {
      onEndCallback();
    }
  });
  req.setTimeout(5000, function(socket){
    console.error('!!! ' + apiName + ' TIMED OUT !!!');
    req.abort();
  });
  req.end();
}

function processResponse(response, onEnd) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    // console.info(str);
    onEnd();
  });
}