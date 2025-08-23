import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();
  const isAuthed = Boolean(accessToken && user);
  const isCreator = user?.role === "creator";
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const navItem =
    "block rounded px-3 py-2 hover:bg-neutral-dark transition text-sm";
  const activeNav = ({ isActive }: { isActive: boolean }) =>
    `${navItem} ${isActive ? "bg-neutral-dark" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-dark bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="inline-block h-6 w-6 rounded bg-secondary"
              aria-hidden
            />
            <span className="text-lg font-extrabold tracking-tight text-primary">
              CloudFlix
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {isCreator && (
            <NavLink to="/upload" className={activeNav}>
              Upload
            </NavLink>
          )}
          {isAuthed ? (
            <>
              <NavLink to="/feed" className={activeNav}>
                Feed
              </NavLink>
              <NavLink to="/me" className={activeNav}>
                Me
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded border border-primary px-3 py-2 text-sm hover:bg-neutral-dark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={activeNav}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded bg-secondary px-3 py-2 text-white text-sm hover:opacity-90"
              >
                Signup
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden rounded border border-neutral-dark px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-neutral-dark bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            <ul className="flex flex-col gap-1">
              <li>
                <NavLink
                  to="/feed"
                  className={activeNav}
                  onClick={() => setOpen(false)}
                >
                  Feed
                </NavLink>
              </li>
              {isCreator && (
                <li>
                  <NavLink
                    to="/upload"
                    className={activeNav}
                    onClick={() => setOpen(false)}
                  >
                    Upload
                  </NavLink>
                </li>
              )}
              {isAuthed ? (
                <>
                  <li>
                    <NavLink
                      to="/me"
                      className={activeNav}
                      onClick={() => setOpen(false)}
                    >
                      Me
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left rounded border border-primary px-3 py-2 text-sm hover:bg-neutral-dark"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className={activeNav}
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className="block rounded bg-secondary px-3 py-2 text-white text-sm hover:opacity-90"
                      onClick={() => setOpen(false)}
                    >
                      Signup
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
