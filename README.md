# New App

## Description

New App is a messaging application that allows users to communicate in real-time with each other. The app includes features such as user authentication, message persistence, message timestamps, and a modern UI design. Users can see who is online and engage in conversations with other registered users.

## User Journeys

### 1. User Registration and Authentication

1. The user opens the app and sees the Sign in with ZAPT interface.
2. The user clicks on one of the available sign-in methods (Google, Facebook, Apple, or Magic Link).
3. Upon successful authentication, the user is redirected to the home page.

### 2. Viewing Users

1. On the home page, the user sees a list of other registered users.
2. The user can scroll through the list to find someone to chat with.
3. Presence indicators show which users are currently online.

### 3. Starting a Chat

1. The user clicks on another user's name from the list.
2. The chat interface opens, displaying past messages between the two users (if any).
3. Messages are ordered chronologically with timestamps.

### 4. Sending Messages

1. The user types a message into the input field at the bottom of the chat.
2. The user clicks the "Send" button to send the message.
3. The message appears in the chat window, and the recipient can see it in real-time.

### 5. Receiving Messages

1. When the other user sends a message, it appears in the chat window without needing to refresh.
2. The app checks for new messages every few seconds to provide a near real-time experience.

### 6. Message Timestamps

1. Each message displays the time it was sent.
2. This allows users to keep track of the conversation flow.

### 7. Read Receipts

1. Messages include indicators showing whether they have been read by the recipient.
2. When the recipient views the message, the read receipt updates accordingly.

### 8. User Presence Indicators

1. Users can see which contacts are online through presence indicators next to their names.
2. This helps users know when others are available to chat.

### 9. Signing Out

1. The user can sign out by clicking the "Sign Out" button at the top of the page.
2. The user is returned to the login screen.

## External API Services

- **Supabase Auth**: Used for user authentication. It allows users to sign in using various providers and manages session handling.
- **Neon Database via Drizzle ORM**: Used for message persistence. All messages are stored in a PostgreSQL database hosted on Neon and accessed through Drizzle ORM.

## Environment Variables

The app requires the following environment variables:

- `VITE_PUBLIC_SENTRY_DSN`: The DSN for Sentry error logging.
- `VITE_PUBLIC_APP_ENV`: The environment (e.g., development, production).
- `VITE_PUBLIC_APP_ID`: The application ID used by ZAPT and Progressier.
- `NEON_DB_URL`: The connection URL for the Neon database.
- `SUPABASE_SERVICE_ROLE_KEY`: The service role key for Supabase admin functions.
- `PROJECT_ID`: The project ID for Sentry logging.
