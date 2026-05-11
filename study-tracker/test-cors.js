const https = require('https');

const options = {
  hostname: 'study-yxi5.onrender.com',
  port: 443,
  path: '/chat',
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://studytrackerbydebg.netlify.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
  console.log('All Headers:', res.headers);
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
