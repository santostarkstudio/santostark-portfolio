with open('assets/index-BMqPMOZ-.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
for m in re.finditer(r'addEventListener\(["\']click["\']', c):
    idx = m.start()
    print('Click listener at:', idx, repr(c[idx-50:idx+200]))

