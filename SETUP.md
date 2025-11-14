# Scene App - Setup Instructions

## Prerequisites Completed ✅

All dependencies have been installed and configured:
- Supabase client SDK
- Expo SecureStore for token storage
- React Hook Form + Zod for validation
- Expo Google Fonts (Allura font)
- React Native Picker

## Important: Supabase Database Setup

Before running the app, you **MUST** set up the database in Supabase:

### Step 1: Run the SQL Setup Script

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `hodibzqnglyjmgkykfaa`
3. Navigate to: **SQL Editor** (in the left sidebar)
4. Click: **New Query**
5. Open the file: `supabase-setup.sql` in this project
6. Copy the entire SQL content
7. Paste it into the SQL Editor
8. Click: **Run** (or press Cmd/Ctrl + Enter)

### Step 2: Verify Database Setup

After running the SQL:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new table: `profiles`
3. Verify the table has these columns:
   - id (uuid, primary key)
   - username (text, unique)
   - age (integer)
   - gender (text)
   - college_name (text, nullable)
   - state (text)
   - city (text)
   - created_at (timestamp)
   - updated_at (timestamp)

4. Go to **Authentication → Policies**
5. Verify RLS policies are enabled for the `profiles` table

## Running the App

### Start the Development Server

```bash
cd /Users/faisalhussain/Desktop/Project/scene_v1
npx expo start
```

### Run on iOS

```bash
# Press 'i' in the terminal, or:
npx expo start --ios
```

### Run on Android

```bash
# Press 'a' in the terminal, or:
npx expo start --android
```

### Run on Web (for testing)

```bash
# Press 'w' in the terminal, or:
npx expo start --web
```

## App Flow

### New User Journey:
1. **Welcome Screen** - Logo + "what's the scene?" tagline
2. Click "Get Started"
3. **Registration Screen** - Email + Password
4. **Profile Setup Screen** - Username, Age, Gender, College, State, City
5. **Home Screen** - Welcome message with profile info

### Returning User Journey:
1. **Welcome Screen**
2. Click "Sign In"
3. **Login Screen** - Email + Password
4. **Home Screen** - Welcome message

## Testing the App

### Test New User Registration:

1. Launch the app
2. You should see the **Welcome Screen** with your logo
3. Click **"Get Started"**
4. Fill in registration form:
   - Email: test@example.com
   - Password: Test1234 (must have uppercase, lowercase, number)
   - Confirm Password: Test1234
5. Click **"Continue"**
6. Fill in profile setup:
   - Username: testuser (will check if available)
   - Age: 20
   - Gender: Select from dropdown
   - College Name: (optional)
   - State: Select from Indian states dropdown
   - City: Enter city name
7. Click **"Complete Setup"**
8. You should see the **Home Screen** with:
   - "Welcome, let's explore what's the scene"
   - Your profile information
   - Logout button

### Test Existing User Login:

1. Launch the app
2. Click **"Sign In"**
3. Enter your credentials
4. You should be redirected to **Home Screen**

### Test Logout:

1. From Home Screen, click **"Logout"**
2. You should be redirected to **Welcome Screen**

## Troubleshooting

### Error: "relation 'public.profiles' does not exist"
- You forgot to run the SQL setup script
- Go back to "Supabase Database Setup" section

### Error: "Username is already taken"
- Try a different username
- The username must be unique across all users

### Error: "Invalid email or password"
- Check your credentials
- Password must be at least 8 characters with uppercase, lowercase, and number

### Font Not Loading
- Make sure you have internet connection (fonts load from Google Fonts)
- Try restarting the Expo server

### App Not Loading After Login
- Check if profile was created successfully in Supabase Table Editor
- Check console logs for errors

## Environment Variables

The `.env` file is already configured with your Supabase credentials:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY

**Important:** Never commit `.env` to version control (already in `.gitignore`)

## Next Steps

After successful authentication implementation:
1. Add Google OAuth (requires additional setup)
2. Implement password reset flow
3. Add email verification
4. Build main app features (marketplace, forums, etc.)
5. Add profile picture upload
6. Implement main navigation

## Need Help?

If you encounter any issues:
1. Check the console logs in Expo
2. Check Supabase logs in Dashboard → Logs
3. Verify your database setup is correct
4. Ensure all dependencies are installed
