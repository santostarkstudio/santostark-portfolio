const fs = require('fs');
const path = require('path');

function patchNav(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Patch Brand Logo / Text Link in Header
  const oldBrand = `m.jsxs(zc,{to:"/",className:"flex flex-col",children:[m.jsx("span",{className:"text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent tracking-wide",children:i.brandName||"SANTO STARK STUDIO"}),m.jsx("span",{className:"block text-[10px] text-slate-400 tracking-widest uppercase font-mono",children:i.brandSubtitle||"cybersecurity and cse"})]})`;
  
  const newBrand = `m.jsxs(zc,{to:"/",onClick:(evt)=>{evt.preventDefault();setActiveNav("/");if(window.starkScrollTo){window.starkScrollTo("home");}else{window.scrollTo({top:0,behavior:"smooth"});}},className:"flex flex-col cursor-pointer",children:[m.jsx("span",{className:"text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent tracking-wide",children:i.brandName||"SANTO STARK STUDIO"}),m.jsx("span",{className:"block text-[10px] text-slate-400 tracking-widest uppercase font-mono",children:i.brandSubtitle||"cybersecurity and cse"})]})`;

  // 2. Patch Mobile Drawer Links
  const oldMobile = `onClick:()=>{setActiveNav(s.path);t(!1);}`;
  const newMobile = `onClick:(evt)=>{const tid=s.path==="/"?"home":s.path.replace("/","");setActiveNav(s.path);t(!1);if(window.starkScrollTo){evt.preventDefault();window.starkScrollTo(tid);}else{const el=document.getElementById(tid);if(el){evt.preventDefault();el.scrollIntoView({behavior:"smooth"});}else if(s.path==="/"){evt.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}}window.history.replaceState(null,"",s.path==="/"?"/":"#"+tid);}`;

  if (!content.includes(oldBrand)) {
    console.error('oldBrand not found in ' + filePath);
    return false;
  }
  if (!content.includes(oldMobile)) {
    console.error('oldMobile not found in ' + filePath);
    return false;
  }

  content = content.replace(oldBrand, newBrand);
  content = content.replace(oldMobile, newMobile);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched navbar in ' + filePath);
  return true;
}

const f1 = path.join(__dirname, 'assets', 'index-BMqPMOZ-.js');
const f2 = path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js');

patchNav(f1);
patchNav(f2);
