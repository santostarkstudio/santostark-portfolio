const fs = require('fs');
const s = fs.readFileSync('source-code/src/pages/Admin.jsx', 'utf8');

// Search for activeTab
let p = 0;
while ((p = s.indexOf('activeTab', p)) !== -1) {
  console.log(p, s.substring(p - 30, p + 80));
  p += 15;
}
