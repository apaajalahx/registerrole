isDomain = require('is-valid-domain');

console.log(isDomain('https://google.com'.replace(/^(https?|ftp):\/\//,'')));
console.log(isDomain('google.com'));