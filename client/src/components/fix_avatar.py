import re

with open('WorkerIdCardModal.tsx', 'r') as f:
    content = f.read()

# Replace finalAvatar with hasAvatar and getInitials
old_avatar_logic = """  const finalAvatar = w.avatar && !w.avatar.includes('1540569014015') 
    ? w.avatar 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(w.name || 'User')}&background=10b981&color=fff&size=150`;"""

new_avatar_logic = """  const hasAvatar = w.avatar && !w.avatar.includes('1540569014015');
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };"""

content = content.replace(old_avatar_logic, new_avatar_logic)

# Replace the first img tag
img1_regex = re.compile(r'<img\s+src=\{finalAvatar\}\s+alt=\{w\.name\}\s+className="(w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm)"\s+crossOrigin=\{finalAvatar\.startsWith\(\'data:\'\) \? undefined : \'anonymous\'\}\s+/>')
img1_replacement = r"""{hasAvatar ? (
            <img
              src={w.avatar}
              alt={w.name}
              className="\1"
              crossOrigin={w.avatar.startsWith('data:') ? undefined : 'anonymous'}
            />
          ) : (
            <div className="\1 bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(w.name)}
            </div>
          )}"""
content = img1_regex.sub(img1_replacement, content)

# Replace the second img tag
img2_regex = re.compile(r'<img\s+src=\{finalAvatar\}\s+alt=\{w\.name\}\s+className="(w-20 h-20 rounded-full object-cover border-4 border-emerald-50 mb-3)"\s+crossOrigin=\{finalAvatar\.startsWith\(\'data:\'\) \? undefined : \'anonymous\'\}\s+/>')
img2_replacement = r"""{hasAvatar ? (
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="\1"
                        crossOrigin={w.avatar.startsWith('data:') ? undefined : 'anonymous'}
                      />
                    ) : (
                      <div className="\1 bg-emerald-600 flex items-center justify-center text-white font-bold text-3xl">
                        {getInitials(w.name)}
                      </div>
                    )}"""
content = img2_regex.sub(img2_replacement, content)

with open('WorkerIdCardModal.tsx', 'w') as f:
    f.write(content)
