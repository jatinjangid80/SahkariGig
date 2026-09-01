import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

# Add useRef to imports
if 'useRef' not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState, useRef } from 'react';")

# Add avatar state and handleImageUpload
state_addition = """
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
"""
content = re.sub(r'const \[isSubmitting, setIsSubmitting\] = useState\(false\);', r'const [isSubmitting, setIsSubmitting] = useState(false);\n' + state_addition, content)

# Change Upload Photo button to use fileInputRef
upload_button = """
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-emerald-400 border border-slate-200 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                    Upload Photo
                  </button>
                </div>
"""
content = re.sub(r'<div className="flex items-center space-x-4 mb-6">.*?Upload Photo\s*</button>\s*</div>', upload_button.strip(), content, flags=re.DOTALL)

# Add supabase.auth.updateUser in handleSubmit
update_user = """
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: profile.fullName,
            phone: profile.phone,
            avatar_url: avatarUrl
          }
        });
      } catch (err) {
        console.error("Error updating user auth metadata", err);
      }
"""
content = re.sub(r'localStorage.setItem\(`worker_profile_\$\{currentUser\.id\}`, JSON.stringify\(savedProfile\)\);', r'localStorage.setItem(`worker_profile_${currentUser.id}`, JSON.stringify(savedProfile));\n' + update_user, content)

# Update avatar usage in supabase upsert
content = content.replace("avatar: currentUser.avatarUrl || `https://ui-avatars.com", "avatar: avatarUrl || currentUser.avatarUrl || `https://ui-avatars.com")

# Fix text-slate-900 to text-white for buttons with emerald background
content = content.replace("bg-emerald-600 hover:bg-emerald-700 text-slate-900", "bg-emerald-600 hover:bg-emerald-700 text-white")
content = content.replace("bg-emerald-500 text-slate-900", "bg-emerald-500 text-white")

# Also, there's a specific submit button that got changed
content = content.replace("px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900", "px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white")

with open('WorkerOnboarding.tsx', 'w') as f:
    f.write(content)
