import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

# Fix step indicator active state
content = content.replace("bg-emerald-500/20 text-emerald-400 border border-emerald-500/50", "bg-emerald-100 text-emerald-700 border border-emerald-300")

# Fix Step X of Y text
content = content.replace('className="text-emerald-400 font-bold text-sm"', 'className="text-emerald-600 font-bold text-sm"')

# Fix Camera icon placeholder
content = content.replace("justify-center text-emerald-400 border border-slate-200", "justify-center text-emerald-600 border border-slate-200")

# Fix alert boxes
content = content.replace("bg-emerald-500/10 border border-emerald-500/30", "bg-emerald-50 border border-emerald-200")
content = content.replace("text-emerald-400 shrink-0", "text-emerald-600 shrink-0")
content = content.replace("text-emerald-100/80", "text-emerald-800")
content = content.replace("text-emerald-100/90", "text-emerald-800")

# Fix radius km text
content = content.replace('span className="text-emerald-400"', 'span className="text-emerald-600"')

with open('WorkerOnboarding.tsx', 'w') as f:
    f.write(content)
