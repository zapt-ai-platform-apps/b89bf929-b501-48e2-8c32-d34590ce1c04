# New App

New App is a modern real-time messaging application that allows users to chat with each other instantly. It features user authentication, message persistence, timestamps, online user indicators, and a user-friendly interface.

## User Journeys

### 1. Sign In

- When the user opens the app, they are greeted with a sign-in screen.
- The user sees the text "Sign in with ZAPT" above the authentication form.
- Below, there is a link to [ZAPT](https://www.zapt.ai) that opens in a new tab.
- The user can sign in using email (magic link) or social providers like Google, Facebook, or Apple.
  
### 2. Real-Time Chatting

- After signing in, the user is redirected to the chat interface.
- The chat interface displays the list of messages in real-time.
- Messages sent by the user appear aligned to the right with a distinct background color.
- Messages sent by other users appear aligned to the left.
- Each message displays the content and the timestamp of when it was sent.
- At the top, the user can see the number of online users currently in the chat.
  
### 3. Sending Messages

- The user can type a message into the input field at the bottom of the chat.
- After typing a message, the user clicks the "Send" button to send the message.
- The message is sent to the server, stored in the database, and broadcast in real-time to all connected users.
- The new message appears immediately in the chat interface for all users.

### 4. User Presence

- The app displays the number of online users in the chat interface.
- When a user joins or leaves the chat, the online user count updates in real-time.

### 5. Sign Out

- The user can sign out by clicking the "Sign Out" button at the top of the chat interface.
- After signing out, the user is redirected back to the sign-in screen.

## External APIs and Services

- **Pusher**: Used for real-time messaging functionality, including message broadcasting and user presence indicators.
- **Neon Database**: Used with Drizzle ORM for storing and retrieving messages in a PostgreSQL database.
- **Supabase Authentication**: Used for user authentication, allowing users to sign in with email or social providers.
- **Sentry**: Used for error logging and monitoring in both the frontend and backend.

## Required Environment Variables

Please set the following environment variables for the app to function correctly:

### Frontend (.env file)

- `VITE_PUBLIC_APP_ID`: Your ZAPT app ID.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for the frontend.
- `VITE_PUBLIC_APP_ENV`: Application environment (e.g., `production`, `development`).
- `VITE_PUBLIC_PUSHER_KEY`: Pusher app key.
- `VITE_PUBLIC_PUSHER_CLUSTER`: Pusher app cluster.

### Backend (Environment Variables)

- `PROJECT_ID`: Your project ID.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for the backend.
- `VITE_PUBLIC_APP_ENV`: Application environment.
- `NEON_DB_URL`: Connection string for the Neon PostgreSQL database.
- `PUSHER_APP_ID`: Pusher app ID.
- `PUSHER_KEY`: Pusher app key.
- `PUSHER_SECRET`: Pusher app secret.
- `PUSHER_CLUSTER`: Pusher app cluster.

## Notes

- The app is responsive and works well on different screen sizes.
- All buttons have hover effects and are optimized for a user-friendly experience.
- Please ensure all environment variables are properly set before running the app.
