import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

state_addition = """
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile({...profile, aadhaar: file.name});
    }
  };
"""

# Insert it before `const [profile, setProfile]`
content = content.replace("const [profile, setProfile] = useState({", state_addition + "\n  const [profile, setProfile] = useState({")

with open('WorkerOnboarding.tsx', 'w') as f:
    f.write(content)
