const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BUNDLES = [
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js')
];

// Read panel template
const contentCjs = fs.readFileSync('patch_full_text_cms.cjs', 'utf8');
const pStart = contentCjs.indexOf('const richTextCmsPanel = `');
const pEnd = contentCjs.indexOf('`;', pStart);
let rawPanel = contentCjs.substring(pStart + 26, pEnd).trim();
const lastText = 'Save All Website Text to Firebase"})';
const idx = rawPanel.lastIndexOf(lastText) + lastText.length;
const validPanel = rawPanel.substring(0, idx) + ']})]})]}),';

console.log('Testing standalone panel syntax...');
new vm.Script('function test(l,Rt,m,AR,x,E,w,v,xc,localStorage,We) { return (' + validPanel.replace(/,$/, '') + '); }');
console.log('Standalone syntax test: PASSED!');

for (const b of BUNDLES) {
  if (!fs.existsSync(b)) continue;
  console.log('\nProcessing:', b);
  let content = fs.readFileSync(b, 'utf8');

  const startMarker = 'l==="textcms"&&';
  const startIdx = content.indexOf(startMarker);
  const endMarker = 'l==="security"&&';
  const endIdx = content.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    content = content.substring(0, startIdx) + validPanel + content.substring(endIdx);
    fs.writeFileSync(b, content, 'utf8');
    console.log('✅ Injected clean valid panel into:', b);
  } else {
    console.log('⚠️ Markers not found properly: startIdx =', startIdx, 'endIdx =', endIdx);
  }
}

