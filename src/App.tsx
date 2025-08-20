import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home"; // feed
import Upload from "./pages/Upload";
import VideoDetail from "./pages/VideoDetail";
import Me from "./pages/Me";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

export default function App() {
  useEffect(() => {
    const { accessToken, refresh, me, logout, user } = useAuthStore.getState();
    (async () => {
      try {
        if (accessToken) {
          await refresh(user?.id);
          await me();
        }
      } catch {
        logout();
      }
    })();
  }, []);
  return (
    <div className="min-h-screen bg-neutral text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/upload"
            element={
              <AuthGuard roles={["creator"]}>
                <Upload />
              </AuthGuard>
            }
          />
          <Route path="/feed" element={<Home />} />
          <Route
            path="/me"
            element={
              <AuthGuard>
                <Me />
              </AuthGuard>
            }
          />
          <Route path="/v/:id" element={<VideoDetail />} />
          <Route path="/home" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
