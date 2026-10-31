# check bundle targets
with open('assets/index-BMqPMOZ-.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx_title = c.find('Santo Stark Studio - Back to Top')
print("idx_title:", idx_title)
print(repr(c[idx_title-150:idx_title+60]))

idx_img = c.find('santo-stark-studio-metallic-title.png')
print("idx_img:", idx_img)
print(repr(c[idx_img-200:idx_img+250]))

