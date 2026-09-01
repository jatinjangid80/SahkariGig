import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

# We need to add an aadhaarInputRef and a handleAadhaarUpload function
state_addition = """
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile({...profile, aadhaar: file.name});
    }
  };
"""
# insert right after handleImageUpload
content = re.sub(r'(const handleImageUpload.*?};\s*};)', r'\1\n' + state_addition, content, flags=re.DOTALL)

# Now modify the step 4 upload button
upload_button_old = """                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <h4 className="text-slate-900 font-medium">Upload Aadhaar Card</h4>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                  </div>"""

upload_button_new = """                  <div 
                    onClick={() => aadhaarInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative"
                  >
                    <input 
                      type="file" 
                      ref={aadhaarInputRef} 
                      className="hidden" 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      onChange={handleAadhaarUpload} 
                    />
                    {profile.aadhaar ? (
                      <>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h4 className="text-emerald-700 font-medium">{profile.aadhaar}</h4>
                        <p className="text-xs text-emerald-600 mt-1">Uploaded successfully</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                        <h4 className="text-slate-900 font-medium">Upload Aadhaar Card</h4>
                        <p className="text-xs text-slate-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                      </>
                    )}
                  </div>"""

content = content.replace(upload_button_old, upload_button_new)

with open('WorkerOnboarding.tsx', 'w') as f:
    f.write(content)
