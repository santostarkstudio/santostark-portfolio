import sys, os, shutil
sys.stdout.reconfigure(encoding='utf-8')

src_bundle = r'public/assets/index-BMqPMOZ-.js'
targets = [
    r'assets/index-BMqPMOZ-.js',
    r'source-code/public/assets/index-BMqPMOZ-.js'
]

with open(src_bundle, 'r', encoding='utf-8') as f:
    content = f.read()

for t in targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    with open(t, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Synced -> {t}')

print('All 3 bundles synced.')

