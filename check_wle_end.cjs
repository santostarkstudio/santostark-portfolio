const fs = require('fs');
const s = fs.readFileSync('assets/index-BMqPMOZ-.js', 'utf8');

const pvIdx = s.indexOf('project-view.html');
const endWle = s.indexOf('function Sle()', pvIdx);
console.log('Between pvIdx and endWle:');
console.log(s.substring(pvIdx + 200, pvIdx + 1200));
console.log('Near endWle:');
console.log(s.substring(endWle - 600, endWle));
