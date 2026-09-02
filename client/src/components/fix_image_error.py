import re

# Fix CustomerDashboard.tsx
with open('CustomerDashboard.tsx', 'r') as f:
    cd = f.read()

# Add imageError state
if 'const [imageError, setImageError] = useState(false);' not in cd:
    cd = cd.replace('const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || \'\');', 
                    'const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || \'\');\n  const [imageError, setImageError] = useState(false);')

# Reset imageError when avatarUrl changes
if 'setImageError(false);' not in cd:
    cd = cd.replace('if (currentUser.avatarUrl) setAvatarUrl(currentUser.avatarUrl);',
                    'if (currentUser.avatarUrl) { setAvatarUrl(currentUser.avatarUrl); setImageError(false); }')

# Add to condition and add onError
cd = cd.replace('{avatarUrl && !avatarUrl.includes("ui-avatars.com") ? (', '{avatarUrl && !avatarUrl.includes("ui-avatars.com") && !imageError ? (')
cd = cd.replace('<img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />', '<img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" onError={() => setImageError(true)} />')

with open('CustomerDashboard.tsx', 'w') as f:
    f.write(cd)

# Fix Navbar.tsx
with open('Navbar.tsx', 'r') as f:
    nav = f.read()

if 'const [imageError, setImageError] = useState(false);' not in nav:
    nav = nav.replace('export const Navbar = ({', 'import { useState } from "react";\n\nexport const Navbar = ({')
    nav = nav.replace('export const Navbar = ({', 'export const Navbar = ({')
    
    # Let's just do a simpler replacement for Navbar
    nav = re.sub(r'export const Navbar = \(\{([^}]*)\}\) => \{', r'export const Navbar = ({\1}) => {\n  const [imageError, setImageError] = useState(false);', nav)

nav = nav.replace('{currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") ? (', '{currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (')
nav = nav.replace('<img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs" />', '<img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs" onError={() => setImageError(true)} />')
nav = nav.replace('<img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />', '<img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm" onError={() => setImageError(true)} />')

with open('Navbar.tsx', 'w') as f:
    f.write(nav)
