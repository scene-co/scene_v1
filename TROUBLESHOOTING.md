# Troubleshooting: "Profile not found for user" Error

## Issue
After removing email verification, you're seeing repeated `LOG  Profile not found for user` messages and the app may not be starting properly.

## Root Cause
You likely have an **old user session** from when email verification was required. This user:
- Is authenticated in Supabase
- Has no email verification (old flow)
- Has no profile created yet
- The app is trying to load their profile repeatedly

## Solution: Clear All App Data

### Option 1: Clear Device/Simulator Data (Recommended)

**For iOS Simulator:**
```bash
# Stop the app
# Delete the app from simulator (long press → delete)
# Or reset simulator completely:
xcrun simctl erase all
```

**For Android Emulator:**
```bash
# Go to Settings → Apps → Expo Go → Storage → Clear Data
# Or use adb:
adb shell pm clear host.exp.exponent
```

**For Physical Device:**
```bash
# Uninstall Expo Go app
# Reinstall from App Store/Play Store
```

---

### Option 2: Clear Supabase Session Programmatically

Add this temporary code to clear the session:

**File:** `app/welcome.tsx`

Add a button temporarily:

```typescript
import { useAuth } from '../contexts/AuthContext';

// Inside component:
const { logout } = useAuth();

// Add this button temporarily:
<Button
  title="Clear Session (Debug)"
  onPress={async () => {
    await logout();
    Alert.alert('Session cleared!');
  }}
  variant="outline"
/>
```

Then:
1. Start the app
2. Tap "Clear Session"
3. Remove the debug button
4. Restart the app

---

### Option 3: Clear via Supabase Dashboard

1. Go to: `https://app.supabase.com/project/hodibzqnglyjmgkykfaa/auth/users`
2. Find any test users you created
3. **Delete them** (they have no profile anyway)
4. Restart your app
5. Create fresh test accounts

---

### Option 4: Add Logout on App Load (Temporary Fix)

Add this to `app/index.tsx` temporarily:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function Index() {
  const { isAuthenticated, hasProfile, isLoading, logout } = useAuth();

  // TEMPORARY: Clear any old sessions
  useEffect(() => {
    const clearOldSession = async () => {
      if (isAuthenticated && !hasProfile) {
        console.log('Clearing old session without profile');
        await logout();
      }
    };
    if (!isLoading) {
      clearOldSession();
    }
  }, [isLoading]);

  // ... rest of code
}
```

**Then:**
1. Restart app
2. Session will be cleared automatically
3. **Remove this temporary code**
4. Restart app again

---

## Quick Fix (Easiest)

Run these commands:

```bash
# Stop the current expo server (Ctrl+C)

# Clear expo cache
npx expo start --clear

# Clear iOS simulator (if using iOS)
xcrun simctl shutdown all && xcrun simctl erase all

# Or clear Android (if using Android)
adb shell pm clear host.exp.exponent
```

---

## Verify It's Fixed

After clearing data, you should see:

1. **App starts** → Welcome screen
2. **Tap "Get Started"** → Register screen
3. **Enter credentials** → Redirects to Login screen
4. **Sign in** → Redirects to Profile Setup
5. **Complete profile** → Redirects to Home screen

**No more "Profile not found" errors!**

---

## Understanding the Log Message

The `LOG  Profile not found for user` message is actually **NORMAL** when:
- A user is authenticated but hasn't created their profile yet
- This is expected during the registration flow

**It's only a problem when:**
- It repeats infinitely (routing loop)
- App doesn't show any screens
- User is stuck

---

## Prevention

To prevent this in the future:

1. **Always clear app data** when making auth flow changes
2. **Delete test users** from Supabase dashboard between tests
3. **Use Incognito/Private mode** for fresh sessions
4. **Clear expo cache** when things seem stuck: `npx expo start --clear`

---

## Still Not Working?

If the issue persists:

1. **Check Supabase RLS Policies:**
   - Make sure you ran `remove-email-verification-rls.sql`
   - Verify policy exists: Go to Dashboard → Database → Policies

2. **Check for TypeScript Errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Check Console for Other Errors:**
   - Look for errors besides "Profile not found"
   - Check for routing errors
   - Check for auth errors

4. **Nuclear Option - Fresh Start:**
   ```bash
   # Delete node_modules
   rm -rf node_modules

   # Clear expo cache
   rm -rf .expo

   # Reinstall
   npm install

   # Clear and restart
   npx expo start --clear

   # Reset simulator/emulator
   # Delete all test users from Supabase
   ```

---

## Expected Behavior After Fix

**First Time User:**
```
1. Welcome screen appears
2. No errors in console
3. Can register successfully
4. Redirected to login
5. Can log in successfully
6. Redirected to profile setup
7. Can complete profile
8. Lands on home screen
```

**Returning User (with profile):**
```
1. App opens
2. Console shows "Auth state changed: SIGNED_IN"
3. Immediately redirects to home screen
4. No "Profile not found" errors
```

---

**Choose the quickest option for you and the app should work!** 🚀

The easiest is usually: Delete the app → Clear expo cache → Restart → Register new account
