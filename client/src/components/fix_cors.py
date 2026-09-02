import re

with open('WorkerIdCardModal.tsx', 'r') as f:
    content = f.read()

# Replace static crossOrigin="anonymous" with conditional
content = content.replace('crossOrigin="anonymous"', "crossOrigin={finalAvatar.startsWith('data:') ? undefined : 'anonymous'}")

with open('WorkerIdCardModal.tsx', 'w') as f:
    f.write(content)
