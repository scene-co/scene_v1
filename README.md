# Scene - College Social Platform 🎓

A modern, secure college social networking app built with React Native and Expo. Scene provides a complete authentication and onboarding system with email verification, enabling students to connect and explore campus life.

## 🌟 Features

### Authentication & Security
- **Email/Password Authentication** - Secure user registration and login via Supabase
- **Email Verification** - Mandatory email confirmation with auto-detection (checks every 5 seconds)
- **Session Management** - Persistent sessions with Expo SecureStore
- **Row-Level Security** - Database-level security policies ensuring data privacy
- **Deep Linking** - Seamless app re-entry after email verification (`scene://`)

### User Onboarding
- **Multi-Step Flow** - Guided onboarding: Welcome → Register → Verify → Login → Profile → Home
- **Profile Setup** - Collect user information:
  - Username (unique, validated in real-time)
  - Age (13+ requirement)
  - Gender (Male, Female, Other, Prefer not to say)
  - College Name (optional)
  - State (Indian states dropdown)
  - City
- **Smart Routing** - Intelligent navigation based on authentication and profile completion state

### UI/UX
- **Reusable Components** - Button, FormInput, FormDropdown
- **Platform-Specific UI** - iOS modal picker, Android native dropdown
- **Form Validation** - Real-time validation with react-hook-form + Zod
- **Loading States** - User-friendly loading indicators
- **Error Handling** - Clear, actionable error messages

## 🛠️ Tech Stack

- **Frontend**: React Native 0.81.5, Expo SDK 54
- **Routing**: Expo Router 6.0.14 (file-based routing)
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Language**: TypeScript 5.9.2
- **Form Management**: React Hook Form 7.66.0
- **Validation**: Zod 3.25.76
- **Secure Storage**: Expo SecureStore 15.0.7
- **Navigation**: React Navigation 7.x

## 📁 Project Structure

```
scene_v1/
├── app/                          # Screens (expo-router)
│   ├── _layout.tsx              # Root layout with AuthProvider
│   ├── index.tsx                # Navigation routing logic
│   ├── welcome.tsx              # Splash/welcome screen
│   ├── register.tsx             # Email + password registration
│   ├── verify-email.tsx         # Email verification screen
│   ├── login.tsx                # Sign in screen
│   ├── profile-setup.tsx        # User profile data collection
│   └── home.tsx                 # Main dashboard
├── components/                   # Reusable UI components
│   ├── Button.tsx               # Styled button (primary, outline, secondary)
│   ├── FormInput.tsx            # Text input with validation
│   └── FormDropdown.tsx         # Platform-specific dropdown
├── contexts/                     # State management
│   └── AuthContext.tsx          # Authentication provider & hooks
├── lib/                         # Utilities
│   └── supabase.ts              # Supabase client configuration
├── schemas/                     # Validation schemas
│   ├── auth.ts                  # Login/register validation (Zod)
│   └── profile.ts               # Profile setup validation (Zod)
├── types/                       # TypeScript definitions
│   └── index.ts                 # User, Profile, Auth types
├── constants/                   # App constants
│   └── indianStates.ts          # State and gender options
└── assets/                      # Images and static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd scene_v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   The `.env` file contains:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://hodibzqnglyjmgkykfaa.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Configure Supabase**

   Follow the detailed guide: [SUPABASE-EMAIL-CONFIG-GUIDE.md](SUPABASE-EMAIL-CONFIG-GUIDE.md)

   Quick setup:
   - Go to [Supabase Dashboard](https://app.supabase.com/project/hodibzqnglyjmgkykfaa/auth/settings)
   - Enable email confirmations
   - Set Site URL to `scene://`
   - Add redirect URL: `scene://`
   - Run the SQL scripts in `supabase-email-verification-setup.sql`

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (for physical devices)

## 📖 Usage

### User Flow

1. **Welcome Screen** - User sees app logo and tagline "what's the scene?"
2. **Get Started** - New users tap "Get Started" to register
3. **Registration** - Enter email and password (validated)
4. **Email Verification** - Check email inbox for verification link
5. **Sign In** - After verification, sign in with credentials
6. **Profile Setup** - Complete profile with username, age, gender, state, city
7. **Home Screen** - Access main app features

### For Existing Users
1. Tap "Sign In" on welcome screen
2. Enter credentials
3. Redirected to home (if profile complete) or profile setup

## 🗄️ Database Schema

### Profiles Table
```sql
profiles (
  id: UUID (references auth.users)
  username: TEXT (unique)
  age: INTEGER
  gender: TEXT
  college_name: TEXT (nullable)
  state: TEXT
  city: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

### RLS Policies
- Users can only read/update their own profile
- Email verification required before profile creation
- Username uniqueness enforced via database function

## 🔐 Security Features

- **Email Verification** - Mandatory before profile creation
- **Secure Token Storage** - Expo SecureStore for auth tokens
- **Row-Level Security** - Supabase RLS policies
- **Password Requirements** - Minimum 8 characters, uppercase, lowercase, number
- **Session Auto-Refresh** - Automatic token refresh
- **Deep Link Validation** - Secure redirect handling

## 📚 Documentation

- [SETUP.md](SETUP.md) - Detailed setup and testing guide
- [UPDATED-FLOW.md](UPDATED-FLOW.md) - Email verification flow documentation
- [EMAIL-VERIFICATION-SETUP.md](EMAIL-VERIFICATION-SETUP.md) - Email configuration guide
- [SUPABASE-EMAIL-CONFIG-GUIDE.md](SUPABASE-EMAIL-CONFIG-GUIDE.md) - Advanced Supabase setup
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes

## 🧪 Testing

### Test Registration Flow
1. Start app: `npx expo start`
2. Tap "Get Started"
3. Enter email: `test@example.com`
4. Enter password: `Test1234`
5. Check email for verification link
6. Click link → Returns to app
7. Sign in with same credentials
8. Complete profile setup

### Test Email Verification
- Use "Resend Verification Email" button if needed
- Check spam folder if email not received
- Use "I've Verified, Continue" for manual check
- Auto-detection runs every 5 seconds

## 🐛 Known Issues & Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify email confirmations enabled in Supabase
- Check Auth Logs in Supabase Dashboard
- Use "Resend" button

### Deep Linking Not Working
- Works best on physical devices
- iOS Simulator has limited deep link support
- Use "I've Verified, Continue" button as fallback

### Session Errors
- Clear app data and restart
- Run `npx expo start --clear`
- Check Supabase connection

See [SUPABASE-EMAIL-CONFIG-GUIDE.md](SUPABASE-EMAIL-CONFIG-GUIDE.md) for detailed troubleshooting.

## 🚧 Roadmap

### Planned Features
- [ ] Google OAuth integration
- [ ] Password reset functionality
- [ ] Profile picture upload
- [ ] College marketplace
- [ ] Forums and discussions
- [ ] Event management
- [ ] Push notifications
- [ ] In-app messaging

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Add comments for complex logic
- Write descriptive commit messages

See [claude.md](claude.md) for detailed code standards and guidelines.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Faisal Hussain** - Initial work

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - React Native framework
- [Supabase](https://supabase.com) - Backend and authentication
- [React Hook Form](https://react-hook-form.com) - Form management
- [Zod](https://zod.dev) - Schema validation

## 📞 Support

For support, email support@sceneapp.com or create an issue in this repository.

---

**Built with ❤️ for college students**

*Scene - Explore what's happening on campus*
