import re

with open('WorkerOnboarding.tsx', 'r') as f:
    content = f.read()

# We want to load initial state from localStorage if it exists
init_logic = """
  // Load draft from localStorage
  const draftStr = localStorage.getItem(`worker_draft_${currentUser?.id || 'demo'}`);
  const draft = draftStr ? JSON.parse(draftStr) : null;

  const [step, setStep] = useState(draft?.step || 1);
  const totalSteps = 8;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  
  const [avatarUrl, setAvatarUrl] = useState(draft?.avatarUrl || currentUser?.avatarUrl || '');

  const [profile, setProfile] = useState(draft?.profile || {
    fullName: currentUser?.name || '',
    phone: '',
    language: 'English',
    skill: 'Electrician',
    experience: '1-3 years',
    coop: 'Delhi Labour Cooperative Federation',
    aadhaar: '',
    membershipId: '',
    location: '',
    radius: 15,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeWindow: '9:00 AM - 6:00 PM',
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    declaration: {
      accurate: false,
      affiliated: false,
      authorize: false,
      genuine: false,
      terms: false
    }
  });

  // Save draft to localStorage on any change
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`worker_draft_${currentUser.id}`, JSON.stringify({
        step,
        avatarUrl,
        profile
      }));
    }
  }, [step, avatarUrl, profile, currentUser?.id]);
"""

# Replace the current state declarations with the init_logic
start_idx = content.find('const [step, setStep] = useState(1);')
end_idx = content.find('const handleImageUpload =')

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + init_logic + '\n  ' + content[end_idx:]
    
    # In handleSubmit, we should clear the draft
    clear_draft = "localStorage.removeItem(`worker_draft_${currentUser.id}`);\n    "
    content = content.replace("setIsSubmitting(false);\n    onComplete();", clear_draft + "setIsSubmitting(false);\n    onComplete();")

    with open('WorkerOnboarding.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Could not find insertion points")

