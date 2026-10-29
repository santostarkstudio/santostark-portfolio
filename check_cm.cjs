const fs = require('fs');
const s = fs.readFileSync('assets/index-BMqPMOZ-.js', 'utf8');

const cm = s.indexOf('function ContinuousMain()');
console.log(s.substring(cm, cm + 1200));
