# Firebase Phone Authentication Setup Guide

## Error You're Seeing

```
auth/argument-error: Firebase phone auth not properly configured
```

This means **Phone authentication is NOT enabled** in your Firebase Console.

---

## ✅ Step-by-Step Setup

### Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **apnafarrukhabad**
3. Left sidebar → **Authentication**
4. Click **Sign-in method** tab
5. Look for **Phone** option
6. Click the phone icon (slider button)
7. **Enable** it (turn it GREEN)
8. Accept the terms and **Save**

![Screenshot: Phone provider toggle in Firebase Authentication settings]

### Step 2: Whitelist Your Domain

For **Development** (localhost):
1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. `localhost` should be auto-added ✅
4. If not, click **Add domain** → type `localhost` → save

For **Production** (deployment):
1. In Firebase Console → **Authentication** → **Settings**
2. Click **Add domain**
3. Enter your domain: `example.com`
4. Save

### Step 3: Check Your Firebase Configuration

In [firebaseConfig.js](src/services/firebaseConfig.js), verify these environment variables are set in your `.env` file:

```env
VITE_FIREBASE_API_KEY=xxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=xxxxxxxxxxxxxx
```

**How to find these values:**
1. Firebase Console → **Project Settings** (gear icon, top-left)
2. Copy values from the `firebaseConfig` object shown there
3. Add to `.env` file with `VITE_` prefix

### Step 4: Restart Dev Server

```bash
npm run dev
```

---

## 🧪 Testing Phone Verification

1. **Go to your Profile page** in the app
2. **Scroll down** to "Verification Status" section
3. **Click "Verify mobile"** button
4. **Enter phone number** with country code: `+91-XXXXXXXXXX`
5. **Click "Send Verification Code"**
6. **Check SMS** on your phone (arrives in 10-30 seconds)
7. **Enter the 6-digit code** in the modal
8. **Click "Verify"**
9. **Success!** ✅ Status shows as "Verified"

---

## 📱 Supported Countries & Format

| Country | Format | Example |
|---------|--------|---------|
| India | +91 | +91-9876543210 |
| USA | +1 | +1-2025551234 |
| UK | +44 | +44-2012345678 |
| Any Country | +CC | +{CountryCode}{PhoneNumber} |

**CC = Country Code**

---

## ❓ Troubleshooting

### "Phone authentication is not enabled"
**Solution**: Follow Step 1 above to enable Phone in Firebase Console

### "SMS not received"
1. Check spam folder
2. Wait 10-30 seconds
3. Verify phone number is active
4. Check number format includes country code: `+91...`
5. Rate limit: Wait 1+ minute before trying again

### "Invalid phone number"
1. Ensure format: `+91-9876543210`
2. Must have country code (e.g., `+91` for India)
3. Remove all special characters except `+`

### reCAPTCHA errors
1. Clear browser cache
2. Check internet connection
3. Reload page: Ctrl+Shift+R (hard refresh)

### Still getting auth/argument-error?
1. Double-check Phone is enabled in Firebase Console
2. Verify domain is whitelisted in Firebase settings
3. Restart dev server: `npm run dev`
4. Clear browser cookies and reload

---

## 🔒 Security Notes

- **reCAPTCHA**: Automatically prevents abuse/bots
- **OTP Expiry**: Codes expire after 5 minutes
- **Rate Limiting**: Max 1 SMS per minute per phone number
- **Firebase Security**: All handled by Google securely

---

## 🚀 Backend Integration

When phone verification is complete:
1. Firebase verifies the OTP automatically
2. User profile in Firestore is updated: `phoneVerified: true`
3. User profile stores: `phone: "+91-9876543210"` and `phoneVerifiedAt: timestamp`

You can then use this in your app logic:
```javascript
if (user?.phoneVerified) {
  // User has verified their phone
  // Grant access to premium features, etc.
}
```

---

## 📞 Need More Info?

- [Firebase Phone Auth Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Setup Steps](https://firebase.google.com/docs/auth/web/start)
- [Supported Region List](https://firebase.google.com/docs/auth/usage-limits)

