# Frontend – Chat Application (Next.js)

This is the **frontend** of the Chat Application built using **Next.js (App Router)**.
It handles authentication, protected routes, UI rendering, API communication, and real-time features.

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Zustand – State management
- Axios – API handling
- Tailwind CSS – Styling
- Socket.IO Client – Real-time communication
- JWT Authentication

---

## Project Structure

```
src/
├── app/                  # App router pages & layouts
├── components/           # Reusable UI components
├── stores/               # Zustand stores
├── services/             # API services & axios setup
├── hooks/                # Custom hooks
├── utils/                # Helper utilities
├── types/                # TypeScript types
└── styles/               # Global & extra styles
```

---

## Authentication Flow

- Access token stored in Zustand
- Refresh token handled via HTTP-only cookies
- Axios interceptors:
  - Attach Authorization header
  - Refresh access token on 401
- Protected routes redirect unauthenticated users to `/login`

---

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Getting Started

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Open http://localhost:3000

---

## API Communication

- Centralized Axios instance
- Automatic token attachment
- Auto refresh on token expiry

---

## Real-time Features

- Socket initialized after authentication
- Supports:
  - One-to-one chat
  - Group chat
  - Message delivery & seen status

---

## Styling

- Tailwind CSS
- Responsive & mobile-friendly
- Dark mode ready

---

## Production Build

```
npm run build
npm run start
```

---

## Notes

- Backend must be running
- Cookies must be enabled
- Tokens persist across page refresh

---

## Author

Rajnish
