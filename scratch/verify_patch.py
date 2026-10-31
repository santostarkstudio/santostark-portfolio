with open('assets/index-BMqPMOZ-.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Verify avatar restored
idx1 = c.find('Click to view full high quality logo in new tab')
print('Avatar tooltip restored:', idx1 != -1, 'at:', idx1)

# 2. Verify title brand image has no-lightbox
idx2 = c.find('no-lightbox')
print('no-lightbox on title:', idx2 != -1, 'at:', idx2)

# 3. Verify pointer-events-none on title img
idx3 = c.find('pointer-events-none filter drop-shadow')
print('pointer-events-none on img:', idx3 != -1)

# 4. Verify brand title still does starkScrollTo
idx4 = c.find('starkScrollTo')
print('starkScrollTo exists:', idx4 != -1)

# Confirm no "Back to Top" title text remains
idx5 = c.find('Back to Top')
print('Back to Top gone:', idx5 == -1)
