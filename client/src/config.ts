export const CONFIG = {
  appName: 'CoopGig',
  appTagline: 'Cooperative gig services, owned by the people who do the work.',
  phase: 'Phase 0 · Foundation',
  version: '0.1.0-foundation',
  apiUrl: import.meta.env.VITE_API_URL || '',
  roles: [
    {
      role: 'Customer',
      tagline: 'Households and community customers',
      description: 'Request verified, transparently priced services from trusted cooperative professionals with accountability and peace of mind.',
      iconName: 'Home'
    },
    {
      role: 'Worker',
      tagline: 'Verified cooperative members',
      description: 'Skilled professionals affiliated with registered Labour Cooperative Federations delivering high-quality household and community services.',
      iconName: 'UserCheck'
    },
    {
      role: 'Cooperative Admin',
      tagline: 'Cooperative staff & governance',
      description: 'Cooperative leadership governing membership, worker verification, skill standards, and society-wide project coordination.',
      iconName: 'ShieldCheck'
    }
  ]
};
