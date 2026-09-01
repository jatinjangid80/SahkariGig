import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

# Safe sequential replace
def repl(match):
    val = match.group(0)
    if val == 'bg-slate-900': return 'bg-slate-50'
    if val == 'bg-slate-800/80': return 'bg-white'
    if val == 'bg-slate-800/50': return 'bg-white/80'
    if val == 'bg-slate-800': return 'bg-white'
    if val == 'border-slate-700/50': return 'border-slate-200'
    if val == 'border-slate-700': return 'border-slate-200'
    if val == 'border-slate-600': return 'border-slate-200'
    if val == 'bg-slate-700/50': return 'bg-slate-50'
    if val == 'bg-slate-700': return 'bg-slate-100'
    if val == 'text-slate-400': return 'text-slate-500'
    if val == 'text-slate-500': return 'text-slate-400'
    if val == 'text-slate-300': return 'text-slate-600'
    if val == 'hover:bg-slate-700/50': return 'hover:bg-slate-50'
    if val == 'hover:bg-slate-600': return 'hover:bg-slate-200'
    return val

pattern = re.compile(r'bg-slate-900|bg-slate-800/80|bg-slate-800/50|bg-slate-800|border-slate-700/50|border-slate-700|border-slate-600|bg-slate-700/50|bg-slate-700|text-slate-400|text-slate-500|text-slate-300|hover:bg-slate-700/50|hover:bg-slate-600')
content = pattern.sub(repl, content)

# Replace text-white to text-slate-900 only if it's not in a button with emerald
# Actually, the simplest way is to regex sub `text-white` to `text-slate-900`, 
# and then manually fix buttons or `hover:text-white` to `hover:text-slate-900`.
# Wait, let's just do `text-white` -> `text-slate-900`, then fix `bg-emerald-600 text-slate-900` back to `text-white`
content = content.replace('text-white', 'text-slate-900')
content = content.replace('bg-emerald-600 text-slate-900', 'bg-emerald-600 text-white')
content = content.replace('bg-emerald-500 text-slate-900', 'bg-emerald-500 text-white')
content = content.replace('text-slate-900 flex items-center justify-center', 'text-white flex items-center justify-center') # Camera icon button

with open('WorkerOnboarding.tsx', 'w') as f:
    f.write(content)
