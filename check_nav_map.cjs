const fs = require('fs');
const s = fs.readFileSync('public/assets/index-BMqPMOZ-.js', 'utf8');

const p = s.indexOf('function GJ()');
// Search for nav items map
const mapIdx = s.indexOf('.map(', p);
console.log('navItems.map at:', mapIdx);
console.log(s.substring(mapIdx, mapIdx + 800));

// And second .map (mobile drawer)
const map2Idx = s.indexOf('.map(', mapIdx + 10);
console.log('Mobile navItems.map at:', map2Idx);
console.log(s.substring(map2Idx, map2Idx + 800));
