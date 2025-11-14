# Supabase Email Configuration Guide

## ⚠️ IMPORTANT: Required Supabase Settings

Your verification emails are not being sent because Supabase needs to be properly configured. Follow these steps **exactly** to enable email verification.

---

## 🔧 Step-by-Step Configuration

### Step 1: Enable Email Confirmations

1. **Go to Supabase Dashboard**:
   ```
   https://app.supabase.com/project/hodibzqnglyjmgkykfaa/auth/settings
   ```

2. **Scroll down to "Email Auth" section**

3. **Find "Enable email confirmations"**
   - Toggle it to **ON** (it should be green)
   - If it's already ON, make sure it's enabled

4. **Click "Save"** at the bottom of the page

---

### Step 2: Configure Site URL (Critical!)

1. **Still in Authentication → Settings**

2. **Find "Site URL" section** (usually near the top)

3. **Set the Site URL to**:
   ```
   scene://
   ```
   OR if that doesn't work:
   ```
   https://hodibzqnglyjmgkykfaa.supabase.co
   ```

4. **Click "Save"**

---

### Step 3: Add Redirect URLs

1. **Still in Authentication → Settings**

2. **Scroll to "Redirect URLs" section**

3. **Add the following URLs** (click "Add URL" for each):
   ```
   scene://
   ```
   ```
   exp://localhost:8081
   ```
   ```
   http://localhost:8081
   ```

4. **Click "Save"**

---

### Step 4: Check Email Rate Limiting

1. **In Authentication → Settings**

2. **Find "Rate Limits" section**

3. **Make sure email rate limits are reasonable**:
   - Default should be fine (e.g., 4 emails per hour per IP)
   - If testing, you can temporarily increase this

---

### Step 5: Verify Email Template Exists

1. **Go to**:
   ```
   https://app.supabase.com/project/hodibzqnglyjmgkykfaa/auth/templates
   ```

2. **Find "Confirm signup" template**

3. **Make sure it's enabled** (toggle should be ON)

4. **Check the template content**:
   - Should have `{{ .ConfirmationURL }}` variable
   - This creates the verification link

---

### Step 6: Check SMTP Settings (Important!)

**Supabase Free Tier Email Limitations:**

By default, Supabase uses their own SMTP server, which has limitations:
- Limited number of emails per hour
- Emails might go to spam
- **Sometimes disabled for new projects**

**To check if emails are enabled**:

1. **Go to**:
   ```
   https://app.supabase.com/project/hodibzqnglyjmgkykfaa/settings/auth
   ```

2. **Look for "SMTP Settings"** or **"Email Settings"**

3. **Check if "Enable Custom SMTP" is available**

**If emails are not working, you have 2 options**:

#### Option A: Use Supabase Default (Recommended for Testing)
- Should work by default
- Limited to a few emails per hour
- Check your spam folder!

#### Option B: Set Up Custom SMTP (Recommended for Production)
You can use:
- **Gmail** (free, easy setup)
- **SendGrid** (free tier available)
- **Mailgun** (free tier available)

---

## 🧪 Testing Email Delivery

### Test 1: Check Supabase Logs

1. **Go to**:
   ```
   https://app.supabase.com/project/hodibzqnglyjmgkykfaa/logs/auth-logs
   ```

2. **Try to sign up with a new email**

3. **Check the logs for**:
   - "Email sent" success message
   - OR error messages like "SMTP error" or "Email disabled"

### Test 2: Use a Real Email Address

1. **Use a real email you can access** (not a fake email)

2. **Try these email providers** (they're most reliable):
   - Gmail
   - Outlook/Hotmail
   - Yahoo

3. **Check spam/junk folder**

### Test 3: Resend Verification Email

1. On the verify-email screen, click **"Resend Verification Email"**

2. Check the app console for any error messages

---

## 🐛 Common Issues and Solutions

### Issue 1: "Email confirmations are disabled"

**Solution**:
- Go to Auth Settings
- Enable "Enable email confirmations"
- Save

### Issue 2: Emails going to spam

**Solution**:
- Check your spam/junk folder
- Mark Supabase emails as "Not Spam"
- For production, set up custom SMTP

### Issue 3: "Invalid redirect URL"

**Solution**:
- Add `scene://` to Redirect URLs
- Make sure Site URL is set correctly
- Save settings

### Issue 4: No email received at all

**Possible causes**:
1. Email confirmations disabled
2. SMTP not configured (for new projects)
3. Email rate limit reached
4. Invalid email address

**Solutions**:
1. Check Auth Settings → Enable email confirmations
2. Check Auth Logs for errors
3. Wait 1 hour and try again
4. Use a real email address

### Issue 5: "Email rate limit exceeded"

**Solution**:
- Wait for the rate limit to reset (usually 1 hour)
- Or increase rate limits in Auth Settings
- For development, you can temporarily disable rate limiting

---

## ✅ Verification Checklist

Before testing, make sure:

- [ ] Email confirmations are **ENABLED**
- [ ] Site URL is set to `scene://`
- [ ] Redirect URLs include `scene://`
- [ ] "Confirm signup" email template exists
- [ ] Using a **real email address** you can access
- [ ] Checked **spam folder**
- [ ] Checked **Auth Logs** for errors

---

## 📧 Email Template Customization (Optional)

If you want to customize the verification email:

1. **Go to**: Auth → Email Templates → Confirm signup

2. **Default template looks like**:
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your user:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   ```

3. **You can customize**:
   - Subject line
   - Email body
   - Add your branding
   - Add custom styling

4. **Important**: Keep `{{ .ConfirmationURL }}` in the template!

---

## 🚀 After Configuration

Once you've completed all the steps above:

1. **Restart your Expo app**:
   ```bash
   # Stop the current server (Ctrl+C)
   npx expo start --clear
   ```

2. **Try signing up again** with a new email

3. **Check your email inbox** (and spam folder)

4. **Look for an email from Supabase**

5. **Click the verification link**

6. **Return to the app** - it should detect verification

---

## 📱 What to Expect

### Successful Flow:
1. User signs up with email and password
2. Verification email sent **immediately**
3. Email arrives within **1-2 minutes**
4. User clicks link in email
5. Browser opens → Redirects to app
6. App shows "Email Verified! 🎉" alert
7. User signs in → Goes to profile setup

### If Email Doesn't Arrive:
1. Wait **2-3 minutes**
2. Check **spam folder**
3. Click **"Resend Verification Email"** button
4. Check **Auth Logs** in Supabase for errors
5. Verify all settings above are correct

---

## 🆘 Still Not Working?

If you've tried everything above and emails still aren't sending:

### Check Auth Logs:

1. Go to: `https://app.supabase.com/project/hodibzqnglyjmgkykfaa/logs/auth-logs`
2. Look for errors related to email sending
3. Common errors:
   - "SMTP connection failed"
   - "Email disabled"
   - "Rate limit exceeded"

### Temporary Workaround (Development Only):

You can temporarily **disable email confirmation** to test the rest of the app:

1. Go to Auth Settings
2. **Disable** "Enable email confirmations"
3. Save

⚠️ **Warning**: This allows users without verified emails! Only use for development testing.

---

## 📞 Need More Help?

If you're still stuck:

1. **Check Supabase Status**: https://status.supabase.com/
2. **Review Supabase Docs**: https://supabase.com/docs/guides/auth/auth-email
3. **Check Supabase Discord**: https://discord.supabase.com/

---

## 🎯 Quick Setup Checklist (TL;DR)

```
1. ✅ Auth Settings → Enable email confirmations → ON
2. ✅ Auth Settings → Site URL → scene://
3. ✅ Auth Settings → Redirect URLs → Add: scene://
4. ✅ Email Templates → Confirm signup → Enabled
5. ✅ Use real email address when testing
6. ✅ Check spam folder
7. ✅ Check Auth Logs for errors
8. ✅ Restart Expo app: npx expo start --clear
```

---

Good luck! The email should start working once you complete these configuration steps.
