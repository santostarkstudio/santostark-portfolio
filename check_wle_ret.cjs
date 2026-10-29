const fs = require('fs');
const s = fs.readFileSync('assets/index-BMqPMOZ-.js', 'utf8');

const wlePos = s.indexOf('function wle()');
const retIdx = s.indexOf('return m.jsx(oo,', wlePos);
console.log('return in wle:');
console.log(s.substring(retIdx, retIdx + 200));

// Find the end of this return statement (before function Sle)
const nextFn = s.indexOf('function Sle()', retIdx);
console.log('end of return in wle:');
console.log(s.substring(nextFn - 300, nextFn));
