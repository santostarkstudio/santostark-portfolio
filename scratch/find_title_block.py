with open('assets/index-BMqPMOZ-.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx_img = c.find('santo-stark-studio-metallic-title.png')
start = c.rfind('m.jsx(zc,', 0, idx_img)
end = c.find('})})', idx_img) + 4
print("Title block:")
print(repr(c[start:end]))

