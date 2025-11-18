# Changelog

All notable changes to the Scene project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-14

### 🎉 Initial Release

Complete authentication and onboarding system implementation for Scene - College Social Platform.

---

## Added

### Authentication System
- ✅ Email/password authentication via Supabase
- ✅ User registration with password validation
  - Minimum 8 characters required
  - Must contain uppercase, lowercase, and number
  - Password confirmation matching
- ✅ Secure login functionality
- ✅ Session management with Expo SecureStore
  - Platform-aware storage (SecureStore for mobile, localStorage for web)
  - Automatic session refresh
  - Persistent sessions across app restarts
- ✅ Logout with complete session cleanup

### Email Verification Flow
- ✅ Mandatory email verification before profile creation
- ✅ Email verification screen with:
  - Auto-detection every 5 seconds
  - Manual "I've Verified, Continue" button
  - Resend verification email functionality
  - User-friendly instructions and tips
- ✅ Deep linking support (`scene://` scheme)
- ✅ Automatic redirect after email verification
- ✅ Updated flow: Registration → Verification → Login → Profile Setup
  - Users must sign in again after email verification for security

### Profile Management
- ✅ Comprehensive profile setup screen
- ✅ Profile fields:
  - Username (unique, 3-20 characters, alphanumeric + underscore)
  - Age (13+ requirement)
  - Gender (Male, Female, Other, Prefer not to say)
  - College Name (optional)
  - State (Indian states dropdown)
  - City (text input)
- ✅ Real-time username availability checking
- ✅ Profile data storage in Supabase
- ✅ Profile validation with Zod schemas

### User Interface
- ✅ Welcome/splash screen with:
  - App logo
  - "what's the scene?" tagline in Allura font
  - "Get Started" button for new users
  - "Sign In" button for existing users
- ✅ Registration screen with form validation
- ✅ Login screen with error handling
- ✅ Email verification screen with auto-check
- ✅ Profile setup screen with dropdown selectors
- ✅ Home screen with welcome message

### Reusable Components
- ✅ **Button Component**
  - Variants: primary, secondary, outline
  - Loading states
  - Disabled states
  - Customizable styling
- ✅ **FormInput Component**
  - Integration with react-hook-form
  - Error message display
  - Secure text entry for passwords
  - Keyboard type support
  - Automatic number conversion for numeric inputs
- ✅ **FormDropdown Component**
  - Platform-specific implementation (iOS Modal, Android Picker)
  - Integration with react-hook-form
  - Dropdown options for gender and Indian states

### Database & Backend
- ✅ Supabase integration with PostgreSQL
- ✅ Profiles table schema:
  - id (UUID, references auth.users)
  - username (TEXT, unique)
  - age (INTEGER)
  - gender (TEXT)
  - college_name (TEXT, nullable)
  - state (TEXT)
  - city (TEXT)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
- ✅ Row-Level Security (RLS) policies:
  - Email verification required for profile creation
  - Users can only read/update their own profile
  - Database-level security enforcement
- ✅ Username uniqueness validation via RPC function
- ✅ SQL setup scripts for easy deployment

### Validation & Forms
- ✅ Form validation with Zod schemas
- ✅ React Hook Form integration
- ✅ Real-time validation feedback
- ✅ Custom error messages
- ✅ Type-safe form handling with TypeScript

### Routing & Navigation
- ✅ Expo Router file-based routing
- ✅ Intelligent navigation logic:
  - Unauthenticated → Welcome screen
  - Authenticated but unverified → Email verification
  - Verified but no profile → Profile setup
  - Complete profile → Home screen
- ✅ Route protection based on auth state
- ✅ Seamless screen transitions

### Configuration & Setup
- ✅ TypeScript configuration with strict mode
- ✅ ESLint configuration for code quality
- ✅ Environment variables for Supabase credentials
- ✅ Deep linking configuration in app.json
- ✅ Platform-specific configurations

### Documentation
- ✅ Comprehensive README.md
- ✅ SETUP.md - Setup and testing guide
- ✅ UPDATED-FLOW.md - Email verification flow documentation
- ✅ EMAIL-VERIFICATION-SETUP.md - Email configuration guide
- ✅ SUPABASE-EMAIL-CONFIG-GUIDE.md - Advanced Supabase setup
- ✅ claude.md - Project context and code standards
- ✅ SQL scripts with detailed comments

---

## Fixed

### Bug Fixes

#### 1. Dropdown Fields Not Working
**Issue**: Gender and state dropdowns were not functional when clicked.

**Root Cause**: React Native Picker works differently on iOS vs Android.

**Fix**:
- Created platform-specific FormDropdown component
- iOS: Modal with picker wheel (scrollable interface)
- Android: Native dropdown menu
- Files modified: `components/FormDropdown.tsx`

#### 2. Age Input Validation Error
**Issue**: Form validation rejected age input with "age must be a number" error despite entering valid numbers.

**Root Cause**: TextInput always returns string values, but Zod schema expected number type.

**Fix**:
- Modified FormInput component to automatically convert numeric inputs
- Added type conversion for `keyboardType: 'number-pad'` and `'numeric'`
- Files modified: `components/FormInput.tsx`

#### 3. RLS Policy Violation (42501)
**Issue**: Error when creating profile: "new row violates row-level security policy for table 'profiles'"

**Root Cause**: Supabase RLS policies blocked unverified users from creating profiles.

**Fix**:
- Implemented mandatory email verification flow
- Updated RLS policies to check for `email_confirmed_at`
- Created SQL scripts with proper policies
- Files modified: `supabase-email-verification-setup.sql`

#### 4. Auth Session Missing Error (First Occurrence)
**Issue**: `checkEmailVerification()` failed with "AuthSessionMissingError: Auth session missing!"

**Root Cause**: Using `getUser()` which requires an active session.

**Fix**:
- Changed to use `refreshSession()` instead
- Files modified: `contexts/AuthContext.tsx`

#### 5. Session Refresh Error on Verify-Email Screen
**Issue**: Repeated "Session refresh error: Auth session missing!" in console during email verification.

**Root Cause**: Auto-polling tried to refresh session before email verification, causing errors with pending sessions.

**Fix**:
- Updated `checkEmailVerification()` with fallback logic:
  - First tries `refreshSession()` for active sessions
  - Falls back to `getSession()` for pending sessions
  - Uses `getUser()` to check latest verification status
- Graceful error handling without console spam
- Files modified: `contexts/AuthContext.tsx`

#### 6. Email Verification Not Sending
**Issue**: Verification emails not being sent from Supabase.

**Root Cause**: Missing `emailRedirectTo` parameter in signup function.

**Fix**:
- Added `emailRedirectTo: 'scene://'` to signup options
- Created comprehensive Supabase configuration guide
- Files modified: `contexts/AuthContext.tsx`, `SUPABASE-EMAIL-CONFIG-GUIDE.md`

---

## Changed

### Flow Modifications
- **Email Verification Flow**: Changed from "Register → Verify → Profile" to "Register → Verify → Login → Profile"
  - Users now must sign in again after email verification for enhanced security
  - Automatic logout after verification
  - Redirect to login screen instead of direct profile setup

### Component Improvements
- FormInput now handles numeric type conversion automatically
- FormDropdown uses platform-specific UI for better UX
- Button component supports multiple variants and states

### Security Enhancements
- Email verification now mandatory before any profile creation
- Session refresh with fallback for pending states
- RLS policies enforce email verification at database level

---

## Technical Details

### Dependencies Added
- `@supabase/supabase-js` ^2.81.1 - Backend and authentication
- `react-hook-form` ^7.66.0 - Form state management
- `zod` ^3.25.76 - Schema validation
- `@hookform/resolvers` ^3.9.1 - Zod integration with react-hook-form
- `expo-secure-store` ^15.0.7 - Secure token storage
- `react-native-url-polyfill` ^2.0.0 - URL polyfill for Supabase
- `@react-navigation/native` ^7.x - Navigation
- `@react-navigation/bottom-tabs` ^7.x - Tab navigation
- `@react-navigation/native-stack` ^7.x - Stack navigation

### Code Statistics
- **Total Source Lines**: ~1,417 lines of TypeScript/TSX
- **Screens**: 8 screens
- **Components**: 3 reusable components
- **Context Providers**: 1 (AuthContext)
- **Validation Schemas**: 2 (auth, profile)
- **SQL Scripts**: 4 setup files
- **Documentation Files**: 6 markdown files

### Files Created/Modified
**Created**: 30+ new files
**Modified**: 5+ existing files
**Total Changes**: 35+ files

---

## Security

### Security Measures Implemented
- ✅ Email verification mandatory before profile access
- ✅ Row-Level Security policies in database
- ✅ Secure token storage with Expo SecureStore
- ✅ Password strength requirements
- ✅ Session auto-refresh
- ✅ Deep link validation
- ✅ User-scoped data access

---

## Performance

### Optimizations
- Automatic session refresh reduces auth failures
- Auto-polling with 5-second interval balances UX and performance
- Platform-specific components for native feel
- Efficient form validation with Zod
- Minimal re-renders with react-hook-form

---

## Known Issues

### To Be Addressed
- Deep linking has limited support on iOS Simulator - use physical devices or manual verification
- Email delivery may be delayed - Supabase free tier limitations
- Email rate limiting - 4 emails per hour per IP by default

See [SUPABASE-EMAIL-CONFIG-GUIDE.md](SUPABASE-EMAIL-CONFIG-GUIDE.md) for workarounds.

---

## Roadmap

### Planned for v0.2.0
- [ ] Google OAuth integration
- [ ] Password reset functionality
- [ ] Profile picture upload
- [ ] "Remember me" option on login

### Planned for v0.3.0
- [ ] College marketplace
- [ ] Forums and discussions
- [ ] Event management
- [ ] Push notifications

---

## Notes

This is the initial release implementing the complete authentication and onboarding system. The foundation is set for building the core social features of the Scene platform.

**Breaking Changes**: None (initial release)

**Migration Guide**: N/A (initial release)

---

[0.1.0]: https://github.com/your-repo/scene/releases/tag/v0.1.0
