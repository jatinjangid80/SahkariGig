import re

# Fix Navbar.tsx
with open('Navbar.tsx', 'r') as f:
    nav = f.read()

nav = nav.replace('currentUser.avatarUrl ? (', 'currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") ? (')
with open('Navbar.tsx', 'w') as f:
    f.write(nav)

# Fix CustomerDashboard.tsx
with open('CustomerDashboard.tsx', 'r') as f:
    cd = f.read()

cd = cd.replace('{avatarUrl ? (', '{avatarUrl && !avatarUrl.includes("ui-avatars.com") ? (')
with open('CustomerDashboard.tsx', 'w') as f:
    f.write(cd)

