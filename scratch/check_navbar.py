with open('source-code/src/components/Navbar.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'title="Santo Stark Studio - Back to Top"'
print('target in Navbar.jsx:', target in c)
idx = c.find('Santo Stark Studio - Back to Top')
print('idx:', idx)
print(repr(c[idx-50:idx+60]))

