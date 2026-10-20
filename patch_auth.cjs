const fs = require('fs');
const jsPath = 'C:/Users/santo/OneDrive/Desktop/santostark-live/assets/index-BMqPMOZ-.js';
let code = fs.readFileSync(jsPath, 'utf8');

const target = 'children:r.resume&&m.jsxs("a"';
const idx = code.indexOf(target);
if (idx !== -1) {
  console.log(code.substring(idx - 100, idx + 400));
} else {
  console.log('not found');
}
