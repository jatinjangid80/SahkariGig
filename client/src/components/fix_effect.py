import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

# Add useEffect to import if not present
if 'useEffect' not in content:
    content = content.replace("import React, { useState, useRef } from 'react';", "import React, { useState, useRef, useEffect } from 'react';")

# The code string to inject
effect_addition = """
  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || ''
      }));
      if (currentUser.avatarUrl && !avatarUrl) {
        setAvatarUrl(currentUser.avatarUrl);
      }
    }
  }, [currentUser]);
"""

# Insert it after the profile state initialization
profile_init_end = "terms: false\n    }\n  });"
content = content.replace(profile_init_end, profile_init_end + "\n" + effect_addition)

with open('WorkerOnboarding.tsx', 'w') as f:
    f.write(content)
