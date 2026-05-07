# ApnaFarrukhabad - Premium Mobile-First Community Platform

A modern, responsive district-level community platform for Farrukhabad, Uttar Pradesh, built with React, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**

## Features

✅ Mobile-first responsive design (390px+)  
✅ Premium glassmorphism UI with smooth animations  
✅ Live feed with infinite scroll & skeleton loaders  
✅ Community incident reporting  
✅ Farming intelligence dashboard  
✅ Live mandi rates with ticker  
✅ Weather + emergency alerts  
✅ Village explorer  
✅ Video reels  
✅ Local marketplace  
✅ Sticky mobile bottom navigation  

## Tech Stack

- **React 19** - UI library
- **Vite 8** - Build tool
- **Tailwind CSS 3** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # All React sections
├── data/               # Mock data
├── App.jsx             # Main component
├── index.css           # Tailwind styles
└── main.jsx            # Entry point
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run ESLint
```

## Firebase Hosting Deploy

The project is set up for Firebase Hosting with SPA rewrites and a build predeploy step.

```bash
firebase login
firebase use apna-farrukhabad
firebase deploy
```

The hosting build output is `dist`, so `firebase deploy` will publish the Vite production build after running `npm run build`.

## Cloudinary Image Workflow

News images are uploaded directly from the browser to Cloudinary, then queued for admin approval before they appear on the home page.

1. Create an unsigned upload preset in Cloudinary.
2. Add your values to a local `.env` file using `.env.example` as the template.
3. Open the report form, pick an image, and the app uploads it immediately to Cloudinary.
4. Submit the report and it enters the moderation queue as pending.
5. Admin reviews the post in `/admin/moderation` and approves or rejects it.
6. Approved posts are shown on the home page in the “Admin approved” section.

Required env vars:

```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
VITE_CLOUDINARY_UPLOAD_FOLDER=apnafarrukhabad/news
```

## Color Palette

- **Green (Agriculture):** #1d6a45, #2b8f5f
- **Saffron (Accent):** #e47522, #ef9346
- **Navy (Headings):** #111f3a
- **White:** #ffffff

## Components

- **Header** - Sticky nav with search, notifications, profile
- **Hero** - Featured banner with CTAs & animated cards
- **Quick Access** - 8-card grid for main actions
- **Live Feed** - Infinite scroll community updates
- **Community CTA** - "Your Voice Matters" upload section
- **Farming Intel** - 6 agriculture dashboard cards
- **Mandi Rates** - Live commodity price cards with ticker
- **Weather & Alerts** - 6 info widgets
- **Village Explorer** - 4-card village grid
- **Reels** - Vertical video card feed
- **Marketplace** - Buy/sell equipment & crops
- **Trust Stats** - Community metrics
- **Mobile Nav** - 5-tab sticky bottom navigation

## Performance

- Lazy image loading
- Skeleton loaders
- Framer Motion viewport constraints
- Intersection Observer for pagination
- Optimized image URLs

## SEO Ready

- Semantic HTML
- Meta tags & OG content
- ARIA labels
- Proper heading hierarchy
- Mobile viewport

## Made for Farrukhabad ❤️
