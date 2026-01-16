# Google OAuth Role Selection Fix

## Issue Identified
When registering as a seller via Google OAuth, the system was defaulting to "Buyer" role instead of honoring the selected "Seller" role.

## Root Cause
The Google authentication button was capturing the role at initialization time, but if users changed their role selection after the button was rendered, the old role value was still being used during authentication.

## Solution Implemented

### Frontend Fix (Register.jsx)
Changed the `handleCredentialResponse` function to capture the current role selection at the moment of authentication rather than relying on the form state:

```javascript
// Before (problematic):
dispatch(googleAuth({ tokenId: response.credential, role: form.role }));

// After (fixed):
const currentRole = document.querySelector('input[name="role"]:checked')?.value || 'Buyer';
dispatch(googleAuth({ tokenId: response.credential, role: currentRole }));
```

### Backend Enhancement (authController.js)
Added comprehensive logging to track role assignment:

```javascript
console.log('Google OAuth - Requested role:', requestedRole);
// ... role assignment logic with additional logging
```

### Redux Thunk Logging (authSlice.js)
Added request logging to verify data being sent:

```javascript
console.log('Sending Google auth request with data:', requestData);
```

## How It Works Now

1. User selects "Seller" role on registration page
2. Clicks Google registration button
3. At authentication time, the system captures the currently selected role
4. Sends the correct role to backend
5. Backend assigns appropriate role ('ProspectiveSeller' for sellers)
6. User gets proper seller access and onboarding flow

## Verification
The fix ensures that:
- Role selection is captured in real-time during Google auth
- Proper logging helps debug any future issues
- Seller users get 'ProspectiveSeller' role and access to seller hub
- Buyer users get 'Buyer' role as expected

## Testing
To verify the fix:
1. Go to registration page
2. Select "Seller" role
3. Click Google registration
4. Check browser console for role logging
5. Verify backend logs show correct role assignment
6. Confirm user gets seller hub access after registration