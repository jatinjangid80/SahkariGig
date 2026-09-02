import re

with open('WorkerIdCardModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("alert('Failed to download PDF. Please try again.');", "alert('Failed to download PDF: ' + (err.message || err));")

with open('WorkerIdCardModal.tsx', 'w') as f:
    f.write(content)
