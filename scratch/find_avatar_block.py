with open('assets/index-BMqPMOZ-.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx_title = c.find('Santo Stark Studio - Back to Top')
start = c.rfind('onClick:', 0, idx_title)
end = c.find('children:m.jsx("div",{className:"w-full h-full bg-dark-900', idx_title)
print("Avatar block:")
print(repr(c[start:end]))

