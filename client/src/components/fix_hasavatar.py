import re

with open('WorkerIdCardModal.tsx', 'r') as f:
    content = f.read()

# Replace hasAvatar logic to also exclude ui-avatars.com
old_logic = "const hasAvatar = w.avatar && !w.avatar.includes('1540569014015');"
new_logic = "const hasAvatar = w.avatar && !w.avatar.includes('1540569014015') && !w.avatar.includes('ui-avatars.com');"

content = content.replace(old_logic, new_logic)

with open('WorkerIdCardModal.tsx', 'w') as f:
    f.write(content)
