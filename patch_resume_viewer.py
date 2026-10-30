import sys
sys.stdout.reconfigure(encoding='utf-8')

bundle_path = r'public/assets/index-BMqPMOZ-.js'
with open(bundle_path, 'r', encoding='utf-8') as f:
    src = f.read()

# Fix admin panel label
old_label = 'children:"Resume / CV Download URL"'
new_label = 'children:"Resume / CV - View URL (Google Drive or PDF)"'
if old_label in src:
    src = src.replace(old_label, new_label)
    print('Admin label updated OK')
else:
    print('WARN: admin label not found - checking...')
    idx = src.find('Resume / CV')
    if idx != -1:
        print('Found at:', idx, repr(src[idx:idx+100]))

# Add placeholder to the resume input
old_input = 'type:"text",value:x.resume||"",onChange:e=>E({...x,resume:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 border border-white/10"'
new_input = 'type:"text",value:x.resume||"",onChange:e=>E({...x,resume:e.target.value}),placeholder:"https://drive.google.com/file/d/YOUR_FILE_ID/view",className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 border border-white/10"'
if old_input in src:
    src = src.replace(old_input, new_input)
    print('Admin input placeholder added OK')
else:
    print('WARN: admin input pattern not found - may already have placeholder')

# Add a helper note below the resume input (after the input div closing)
old_resume_div_end = 'type:"text",value:x.resume||"",onChange:e=>E({...x,resume:e.target.value}),placeholder:"https://drive.google.com/file/d/YOUR_FILE_ID/view",className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 border border-white/10"})]}'
new_resume_div_end = 'type:"text",value:x.resume||"",onChange:e=>E({...x,resume:e.target.value}),placeholder:"https://drive.google.com/file/d/YOUR_FILE_ID/view",className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 border border-white/10"}),m.jsx("p",{className:"text-[10px] text-emerald-400/70 mt-1",children:"Paste your Google Drive share link or any PDF URL. Opens as view-only in a new tab."})]}'
if old_resume_div_end in src:
    src = src.replace(old_resume_div_end, new_resume_div_end)
    print('Helper note added OK')
else:
    print('WARN: helper note anchor not found (placeholder may not have been added yet)')

with open(bundle_path, 'w', encoding='utf-8') as f:
    f.write(src)
print('Bundle saved.')

