const fs = require('fs');
const s = fs.readFileSync('assets/index-BMqPMOZ-.js', 'utf8');

const wlePos = s.indexOf('function wle()');
console.log('function wle at:', wlePos);
// Find end of wle
const wleEnd = s.indexOf('function Sle()', wlePos);
console.log('wle length:', wleEnd - wlePos);
console.log(s.substring(wleEnd - 500, wleEnd));
