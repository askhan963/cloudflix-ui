# CloudFlix UI

A minimal-but-polished TikTok-style web app frontend built with React + TypeScript + Vite, Tailwind CSS, Axios, Zustand, React Query, and react-hook-form + zod.  
Implements authentication, video feed, upload flow, ratings, and comments against the CloudFlix API.

---

## 🚀 Tech Stack
- [React 18 + TypeScript](https://react.dev/)
- [Vite](https://vitejs.dev/) for fast dev/build
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Router](https://reactrouter.com/) for routing
- [Axios](https://axios-http.com/) with interceptors for API
- [Zustand](https://github.com/pmndrs/zustand) for auth store
- [React Query](https://tanstack.com/query/latest) for data fetching/caching
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) for forms/validation

---

## ⚙️ Requirements
- Node.js **>=18**
- npm **>=9**

---

## 📦 Installation

```bash
# clone repo
git clone <your-repo-url>
cd cloudflix-ui

# install deps
npm install
````

---

## 🔑 Environment Variables

Create a `.env` file at the project root:

```bash
VITE_API_BASE_URL=https://<your-api>.azurewebsites.net/api
```

⚠️ The API base URL must already include `/api`.

See `.env.example` for reference.

---

## 🛠️ Scripts

```bash
# start dev server
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173).

```bash
# type-check and build production bundle
npm run build
```

```bash
# preview built app (serves dist/)
npm run preview
```

Runs on [http://localhost:4173](http://localhost:4173).

```bash
# lint code
npm run lint
```

---

## 📂 Project Structure

```
src/
  api/              # axios instance + feature APIs
  components/       # Navbar, AuthGuard, VideoCard, etc.
  config/           # env loader
  hooks/            # React Query hooks
  lib/              # types, zod validators, utils
  pages/            # Landing, Login, Signup, Feed, etc.
  store/            # auth store (Zustand)
  main.tsx          # app bootstrap
  App.tsx           # routes
```

---

## 🌐 Routes

* `/` → Landing page
* `/feed` → Video feed (paginated)
* `/login` → Login form
* `/signup` → Signup form
* `/upload` → Upload form (creator only, protected)
* `/v/:id` → Video detail page
* `/me` → Profile & my videos (protected)
* `/*` → 404 Not Found

---

## ✅ Development Flow

1. `npm run dev` → work locally
2. Set your API base in `.env`
3. Implement pages/components → build with `npm run build`
4. Test production build → `npm run preview`

---

