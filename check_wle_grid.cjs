const fs = require('fs');
const s = fs.readFileSync('assets/index-BMqPMOZ-.js', 'utf8');

const pvIdx = s.indexOf('project-view.html');
// Look forward for children end of grid
const endGrid = s.indexOf(',o.id))})', pvIdx);
console.log('endGrid at:', endGrid);
console.log(s.substring(endGrid, endGrid + 400));
