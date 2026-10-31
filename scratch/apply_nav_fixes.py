import sys

BUNDLE_PATHS = [
    'public/assets/index-BMqPMOZ-.js',
    'assets/index-BMqPMOZ-.js',
    'source-code/public/assets/index-BMqPMOZ-.js'
]

AVATAR_OLD = 'onClick:(evt)=>{evt.preventDefault();setActiveNav("/");if(window.starkScrollTo){window.starkScrollTo("home");}else{window.scrollTo({top:0,behavior:"smooth"});}},className:"w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform cursor-pointer",title:"Santo Stark Studio - Back to Top",'

AVATAR_NEW = 'onClick:s=>{const _logo=i.brandLogo||"/assets/brand-logo.webp";if(_logo){s.preventDefault(),s.stopPropagation();if(_logo.startsWith("data:")){const o=window.open("","_blank");o&&o.document.write(`<html style="background:#090a0f;"><head><title>Brand Logo Preview</title></head><body style="margin:0;background:#090a0f;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${_logo}" style="max-width:95vw;max-height:95vh;object-fit:contain;box-shadow:0 0 40px rgba(34,211,238,0.3);border-radius:16px;" /></body></html>`)}else window.open(_logo,"_blank")}},className:"w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform cursor-pointer",title:i.brandLogo?"Click to view full high quality logo in new tab \\u2197":"Santo Stark Studio Logo",'

TITLE_OLD = 'm.jsx(zc,{to:"/","aria-label":"Santo Stark Studio Home",onClick:(evt)=>{evt.preventDefault();setActiveNav("/");if(window.starkScrollTo){window.starkScrollTo("home");}else{window.scrollTo({top:0,behavior:"smooth"});}},className:"flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink min-w-0",children:m.jsx("img",{src:"/assets/santo-stark-studio-metallic-title.png",alt:"Santo Stark Studio",className:"h-6 sm:h-7 md:h-8 lg:h-9 w-auto max-w-[180px] sm:max-w-[230px] md:max-w-none object-contain select-none pointer-events-auto filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]",loading:"eager"})})'

TITLE_NEW = 'm.jsx(zc,{to:"/","aria-label":"Santo Stark Studio Home",onClick:(evt)=>{evt.stopPropagation();if(window.location.pathname==="/"||window.location.pathname===""){evt.preventDefault();setActiveNav("/");if(window.starkScrollTo){window.starkScrollTo("home");}else{window.scrollTo({top:0,behavior:"smooth"});}}else{setActiveNav("/");setTimeout(()=>{if(window.starkScrollTo){window.starkScrollTo("home");}else{window.scrollTo({top:0,behavior:"smooth"});}},100);}},className:"flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink min-w-0 no-lightbox",children:m.jsx("img",{src:"/assets/santo-stark-studio-metallic-title.png",alt:"Santo Stark Studio",className:"h-6 sm:h-7 md:h-8 lg:h-9 w-auto max-w-[180px] sm:max-w-[230px] md:max-w-none object-contain select-none pointer-events-none filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] no-lightbox",loading:"eager"})})'

for p in BUNDLE_PATHS:
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    
    if AVATAR_OLD not in c:
        print(f"Error: AVATAR_OLD not found in {p}")
        sys.exit(1)
    if TITLE_OLD not in c:
        print(f"Error: TITLE_OLD not found in {p}")
        sys.exit(1)
        
    c = c.replace(AVATAR_OLD, AVATAR_NEW, 1)
    c = c.replace(TITLE_OLD, TITLE_NEW, 1)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Patched successfully: {p}")

