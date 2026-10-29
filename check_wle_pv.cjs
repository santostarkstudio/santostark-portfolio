const fs = require('fs');
const s = fs.readFileSync('assets/index-BMqPMOZ-.js', 'utf8');

const wlePos = s.indexOf('function wle()');
const pvIdx = s.indexOf('project-view.html', wlePos);
console.log('project-view.html at:', pvIdx);
console.log(s.substring(pvIdx, pvIdx + 600));
