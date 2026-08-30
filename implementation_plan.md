# Update Customer Dashboard Tabs & Remove Mock Data

The customer dashboard currently uses a different set of tabs (Overview, My Bookings, History, Messages) than the provided design spec (Book Service, My Jobs, Pay & Review, Profile). It also renders hardcoded mock data when the database is empty. 

## Proposed Changes

### 1. Remove Hardcoded Data
I will remove the hardcoded fallback data in `CustomerDashboard.tsx` so that when there are no bookings, it legitimately shows an empty state rather than fake data.

### 2. Update Tabs
I will update the tab structure in `CustomerDashboard.tsx` to match your specification:
- **Book Service**: This will be the default tab. It will show the category picker and request form (or redirect to the `/services` flow).
- **My Jobs**: This will consolidate the current "My Bookings" and "History" tabs into one place, showing all Active and Completed jobs.
- **Pay & Review**: This will show pending payments and review prompts.
- **Profile**: This will show user details, addresses, and history.

## Open Questions
- For the "Book Service" tab, should it render the `HeroSection` / `WorkerDirectory` directly inside the dashboard, or should it act as a shortcut to the `/services` page?
- Where should the "Messages" (Chat) functionality live? Should we keep a 5th tab for Messages, or put a message button inside the "My Jobs" section?

Please approve this plan or let me know your preferences for the open questions!
