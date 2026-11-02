# Tikoy Pass-Around

A Filipino-Chinese New Year web app where users gift virtual Tikoy with personalized lucky messages. Recipients must pass it forward within 24 hours to keep the luck alive. Tracks how far each Tikoy travels across users, celebrating the Filipino-Chinese tradition of sharing Tikoy (nian gao) as a symbol of good luck, prosperity, and togetherness during Chinese New Year.

## Features

### Milestone 1: Tikoy Gifting System (In Progress)
- Users create virtual Tikoy and write personalized lucky messages
- Recipients notified and must pass forward within 24 hours
- Each Tikoy has unique chain ID tracking every person
- Real-time countdown timer

### Milestone 2: Chain Tracker & Luck Map (Coming Soon)
- Visual chain tracker showing Tikoy journey
- Interactive map/timeline of each Tikoy origin to current holder
- Leaderboard of longest-traveling Tikoys

### Milestone 3: Personalized Lucky Messages (Coming Soon)
- Pre-written lucky messages based on Chinese zodiac sign
- Hokkien phrases (Filipino-Chinese culture)
- CNY stickers and red envelope aesthetics

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`, Firebase (backend)

## Getting Started

### Prerequisites

- Node.js 20+ installed
- Firebase account
- Cloudflare account and Wrangler login (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd tikoy-pass-around
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location closest to your target audience

4. Enable **Authentication**:
   - Go to Authentication
   - Click "Get Started"
   - Enable "Email/Password" sign-in method

5. Get your Firebase credentials:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Web" icon `</>`
   - Register app with nickname (e.g., "tikoy-web")
   - Copy the Firebase configuration

### 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Firebase Security Rules (Important!)

Deploy Firestore security rules to protect your data:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in the project:
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Accept default file locations

4. Replace `firestore.rules` with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {

       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId;
       }

       match /tikoys/{tikoyId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update: if request.auth.uid == resource.data.currentHolderId;
       }

       match /chains/{chainId} {
         allow read: if request.auth != null;
         allow write: if false;
       }

       match /notifications/{notificationId} {
         allow read: if request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

5. Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Deployment to Cloudflare Workers

This app uses `@opennextjs/cloudflare`, not `@cloudflare/next-on-pages`.

1. Install dependencies and log in to Wrangler:

   ```bash
   npm install
   npx wrangler login
   ```

2. Set the Firebase values in `.env.local` for local builds. The same values are
   declared in `wrangler.jsonc` as runtime variables, and `src/lib/firebase/config.ts`
   falls back to the project's public web config if they are absent.

3. Build and deploy:

   ```bash
   npm run deploy
   ```

The Worker is named `tikoy-pass-around` and is served from
`https://tikoy-pass-around.gmawong10.workers.dev`. `robots.txt` and `sitemap.xml`
are generated from `src/app/robots.ts` and `src/app/sitemap.ts`.

To preview the Worker runtime locally:

```bash
npm run preview
```
### 3. Firebase Functions (Coming in Milestone 1)

Cloud Functions for notifications will be set up later. Instructions will be added when implemented.

## Project Structure

```
tikoy-pass-around/
|-- src/
|   |-- app/                    # Next.js App Router pages
|   |-- components/             # React components
|   |-- lib/                    # Firebase, storage, and helper code
|   `-- types/                  # TypeScript type definitions
|-- public/                     # Static assets
|-- open-next.config.ts         # OpenNext Cloudflare configuration
`-- wrangler.jsonc              # Cloudflare Worker configuration
```

## Development Roadmap

- [x] Project setup and authentication
- [x] Firebase integration
- [ ] Tikoy creation UI
- [ ] Tikoy viewer with countdown
- [ ] Pass Tikoy functionality
- [ ] Notification system
- [ ] Chain visualization
- [ ] Leaderboard
- [ ] Message templates
- [ ] Sticker library

## Contributing

This is a cultural project celebrating Filipino-Chinese New Year. Contributions for cultural authenticity, Hokkien translations, and user experience improvements are welcome.

## License

MIT

---

**Gong xi fa cai! Huat ah!** 🧧🎊
