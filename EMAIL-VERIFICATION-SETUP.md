# Email Verification Setup Guide

## ✅ Implementation Complete!

Email verification has been successfully implemented in your Scene app. Follow these steps to configure Supabase and test the flow.

---

## 🔧 Supabase Configuration (REQUIRED)

### Step 1: Enable Email Confirmations

1. Go to: https://app.supabase.com/project/hodibzqnglyjmgkykfaa/auth/settings
2. Scroll to **"Email Auth"** section
3. Find **"Enable email confirmations"**
4. Toggle it to **ON** (if not already enabled)
5. Click **Save**

### Step 2: Configure Redirect URL

1. Still in **Authentication → Settings**
2. Scroll to **"URL Configuration"**
3. Find **"Redirect URLs"** section
4. Add this URL: `scene://`
5. Click **Add URL**
6. Click **Save**

### Step 3: Run the SQL Script

1. Go to: https://app.supabase.com/project/hodibzqnglyjmgkykfaa/sql
2. Click **New Query**
3. Open the file: `supabase-email-verification-setup.sql`
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or Cmd/Ctrl + Enter)
7. Verify you see: "Email verification RLS policies created successfully!"

### Step 4: Verify Policies

1. Go to: **Authentication → Policies**
2. Find the `profiles` table
3. You should see 3 policies:
   - ✅ "Verified users can insert own profile" (INSERT)
   - ✅ "Users can read own profile" (SELECT)
   - ✅ "Users can update own profile" (UPDATE)

---

## 📧 Email Template Customization (Optional)

To customize the verification email:

1. Go to: **Authentication → Email Templates**
2. Select **"Confirm signup"** template
3. Customize the subject and body
4. Available variables:
   - `{{ .ConfirmationURL }}` - Verification link
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .Email }}` - User's email
5. Click **Save**

---

## 🎯 New User Flow

### Registration Flow:
1. User opens app → **Welcome screen**
2. Taps "Get Started"
3. **Registration screen** → Enter email + password
4. **Email Verification screen** appears
   - Shows user's email address
   - "I've verified, continue" button
   - "Resend verification email" button
   - Auto-checks verification every 5 seconds
5. User checks email inbox
6. Clicks verification link in email
7. Returns to app (auto-redirected)
8. **Profile Setup screen** → Enter username, age, gender, etc.
9. **Home screen** → "Welcome, let's explore what's the scene"

### Login Flow (Existing User):
1. User opens app → **Welcome screen**
2. Taps "Sign In"
3. **Login screen** → Enter email + password
4. If email not verified → **Email Verification screen**
5. If email verified but no profile → **Profile Setup screen**
6. If email verified + profile complete → **Home screen**

---

## 🧪 Testing the Flow

### Test New User Registration:

1. Start the app:
   ```bash
   npx expo start
   ```

2. Create a new account:
   - Email: `test@example.com` (use a real email you can access)
   - Password: `Test1234`

3. You should see the **Email Verification screen**

4. Check your email inbox (and spam folder)

5. Click the verification link

6. You should be redirected back to the app

7. The app should navigate to **Profile Setup**

8. Complete your profile

9. You should land on **Home screen**

### Test Resend Email:

1. On the verification screen
2. Click "Resend Verification Email"
3. Check your inbox for a new email

### Test "I've Verified" Button:

1. After clicking the verification link
2. Return to the app
3. Click "I've Verified, Continue"
4. Should navigate to Profile Setup

---

## 🐛 Troubleshooting

### Issue: "new row violates row-level security policy"

**Solution:** Make sure you ran the SQL script from Step 3 above.

### Issue: Not receiving verification email

**Possible causes:**
1. Email confirmations not enabled in Supabase → Check Step 1
2. Email in spam folder → Check spam
3. Invalid email address → Use a real email

**Solutions:**
- Enable email confirmations in Supabase Dashboard
- Check spam/junk folder
- Use the "Resend" button

### Issue: Verification link doesn't redirect to app

**Possible causes:**
1. Redirect URL not configured → Check Step 2
2. Deep linking not working on device

**Solutions:**
- Add `scene://` to redirect URLs in Supabase
- On iOS Simulator: Deep links may not work, use "I've Verified" button
- On Android Emulator: May need to configure intent filters

### Issue: App not detecting verification

**Solution:**
- Click the "I've Verified, Continue" button
- The app auto-checks every 5 seconds
- Restart the app if needed

---

## 🔐 Security Notes

- Email verification is **REQUIRED** before profile creation
- Users cannot create profiles without verified email
- RLS policies enforce email verification at database level
- Verification links expire after a certain time (configurable in Supabase)

---

## 📱 Deep Linking (Advanced)

The app is configured with the scheme: `scene://`

### How it works:
1. User clicks email verification link
2. Link format: `https://[your-project].supabase.co/auth/v1/verify?token=...&type=signup&redirect_to=scene://`
3. Browser opens the link
4. Supabase verifies the token
5. Redirects to: `scene://`
6. App opens automatically (on physical devices)
7. App detects verified state and navigates to Profile Setup

### Note:
- Deep linking works best on **physical devices**
- iOS Simulator and Android Emulator may have limited deep link support
- Users can always use the "I've Verified, Continue" button as a fallback

---

## ✨ What Changed

**New Files:**
- `app/verify-email.tsx` - Email verification screen
- `supabase-email-verification-setup.sql` - SQL for RLS policies
- `EMAIL-VERIFICATION-SETUP.md` - This guide

**Modified Files:**
- `contexts/AuthContext.tsx` - Added email verification methods
- `app/register.tsx` - Navigate to verify-email after signup
- `app/index.tsx` - Check email verification in routing
- Deep linking already configured in `app.json`

**Database Changes:**
- RLS policies now check for `email_confirmed_at`
- Only verified users can insert profiles

---

## 🎉 Ready to Test!

Your app now has complete email verification! Follow the Supabase configuration steps above, then test the registration flow.

Need help? Check the troubleshooting section or review the code in:
- [contexts/AuthContext.tsx](contexts/AuthContext.tsx:1) - Auth logic
- [app/verify-email.tsx](app/verify-email.tsx:1) - Verification UI
- [app/index.tsx](app/index.tsx:1) - Routing logic
