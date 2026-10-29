const fs = require('fs');
const s = fs.readFileSync('public/assets/index-BMqPMOZ-.js', 'utf8');

const p = s.indexOf('function GJ()');
// Find the onClick in GJ()
const onClickIdx = s.indexOf('onClick:', p);
console.log('onClick in GJ():');
console.log(s.substring(onClickIdx, onClickIdx + 500));

// Find mobile onClick in GJ()
const mobOnClickIdx = s.indexOf('onClick:', onClickIdx + 50);
console.log('Mobile onClick in GJ():');
console.log(s.substring(mobOnClickIdx, mobOnClickIdx + 500));
