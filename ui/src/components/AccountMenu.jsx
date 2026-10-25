import { useEffect, useRef, useState } from "react";
import { clearToken, clearUser, getToken, getUser } from "../auth.js";
import "./account-menu.css";

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

// Site-header account area: a "Log in" link when signed out, otherwise a
// circled first-name initial opening a menu with the profile page and logout.
export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    function onEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!getToken()) {
    return <a className="admin-link" href="/login">Log in</a>;
  }

  const user = getUser();
  const initial = (user?.first_name || user?.email || "?").trim().charAt(0).toUpperCase() || "?";

  function logOut() {
    clearToken();
    clearUser();
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className="account-avatar"
        aria-label="Open your account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {initial}
      </button>
      {open && (
        <div className="account-dropdown" role="menu" aria-label="Account">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            Profile
          </button>
          <button type="button" role="menuitem" onClick={logOut}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
