# ApnaFarrukhabad Complete Workflow Guide

## Overview
The complete user workflow is now active and ready for testing. Users can sign up, sign in, upload news with images, and admins can approve submissions for publication on the home page.

## Test Accounts

Use your Firebase-authenticated account for testing. Admin access is granted when the user record or Firebase custom claims mark the account as admin.

## Complete Workflow Steps

### Step 1: Sign Up (New User)
1. Go to `/signup` page
2. Enter your name, email, and password
3. Click "Create account"
4. You'll be redirected to home page and logged in

### Step 2: Sign In (Existing User)
1. Go to `/login` page
2. Enter email and password
3. Click "Sign in"
4. You'll be redirected to home page and logged in

### Step 3: View User Profile
1. Once logged in, look at the Header
2. Desktop: Click on your name in the top-right corner
3. Mobile: Open the menu and you'll see your profile info
4. Profile shows your name, email, and role (if admin)
5. Logout button available in the dropdown/menu

### Step 4: Upload News (Users)
1. Click "Report" / "Upload News" in the header or menu
2. **Note:** You must be logged in; if not, you'll be redirected to login
3. Fill in the form:
   - **Title:** News headline
   - **Village:** Select from dropdown
   - **Category:** Choose category
   - **Image:** Click to upload image (saved to Cloudinary)
   - **Description:** Detailed story (minimum 20 words)
   - **Name:** Pre-filled with your logged-in name (read-only)
   - **Email:** Pre-filled with your email (read-only)
   - **Phone:** Your contact number
4. Click "Submit"
5. You'll see a confirmation: "Sent to admin for approval"

### Step 5: Admin Approval Process (Admins)
1. Log in with an account that has admin access in Firebase
2. Header will show "Admin" label in profile dropdown
3. Click admin profile → "Admin Panel"
4. You'll see the Moderation Queue with:
   - **Pending stats:** Count of pending submissions
   - **Approved stats:** Count of approved submissions
   - **Pending submissions:** List of all pending uploads
5. For each pending submission:
   - Click "Approve" to publish to home page
   - Click "Reject" to remove without publishing
6. Approved submissions move to "Recently approved" section
7. Approved submissions now appear on home page in "Community uploads live on the home page" section

### Step 6: View Approved News (All Users)
1. Go to home page (`/`)
2. Look for "Community uploads live on the home page" section
3. See all admin-approved user submissions
4. Shows: Image, title, description, category, village, and reporter name

## Key Features

### Authentication
- ✅ Sign up with new email
- ✅ Sign in with credentials
- ✅ Logout
- ✅ Automatic re-login on page refresh (token-based)
- ✅ Protected routes (Report, UploadVideo require auth)

### User Profile
- ✅ Shows logged-in user name and email
- ✅ Admin badge for admin users
- ✅ One-click access to admin panel (if admin)
- ✅ Logout button

### News Upload
- ✅ Form fields pre-populate with user info
- ✅ Image upload to Cloudinary
- ✅ Validation on all fields
- ✅ Submission goes to moderation queue

### Image Management
- ✅ Upload to Cloudinary
- ✅ Preview before submitting
- ✅ Replace or remove image
- ✅ Cloudinary folder organization

### Moderation
- ✅ Pending queue displays reporter info (name, phone)
- ✅ Image preview in moderation cards
- ✅ Approve button moves to published
- ✅ Reject button removes submission
- ✅ Recently approved section shows approved items
- ✅ Count stats for pending and approved

### Home Page Integration
- ✅ Approved submissions section shows on home page
- ✅ Updates in real-time when admin approves
- ✅ Shows reporter name, category, village
- ✅ Displays image and full submission text

## Testing Scenarios

### Scenario 1: Complete User Journey
1. Sign up as new user
2. Go to Report page
3. Upload news with image
4. Switch to admin account
5. Approve the submission
6. Check home page to see submission

### Scenario 2: Admin Rejection
1. User submits news
2. Admin rejects it
3. Submission disappears from pending
4. Doesn't appear on home page

### Scenario 3: Multiple Submissions
1. Submit 3 different news items as user
2. Admin approves 2 and rejects 1
3. Only 2 appear on home page
4. Stats update correctly

### Scenario 4: Mobile Flow
1. Sign up on mobile
2. Upload news on mobile
3. Admin approves on mobile
4. Check home page on mobile

## Data Storage

- **Auth data:** localStorage (token-based)
- **Submissions:** localStorage (af_media_moderation_v1 key)
- **Images:** Cloudinary cloud storage
- **User info:** Automatically captured from logged-in user

## Environment Variables Needed

Make sure these are set in `.env`:
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_UPLOAD_FOLDER=apnafarrukhabad/news
```

## Troubleshooting

### Issue: Can't access Report page
- **Fix:** Make sure you're logged in. If not logged in, you'll be redirected to login.

### Issue: Image won't upload
- **Fix:** Check Cloudinary credentials in `.env`. Make sure image file is valid (PNG, JPG, JPEG, WebP).

### Issue: Admin can't see submissions
- **Fix:** Make sure the Firebase user has the admin role or admin claim. Check that submissions are in pending state.

### Issue: Approved news doesn't show on home page
- **Fix:** Refresh the page. Check that NewsroomDashboard is on home page. Verify moderation service localStorage is working.

## Future Enhancements

- [ ] Backend persistence (Firebase/Database)
- [ ] Email notifications on approval
- [ ] Edit/delete submissions by user
- [ ] Comment system on approved posts
- [ ] User reputation/badges
- [ ] Advanced moderation (flag, spam detection)
- [ ] Analytics dashboard
