import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Nav({ darkMode, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="nav">
      <div className="nav__left">
        <span className="nav__logo">threads-app</span>
      </div>
      <div className="nav__right">
        <button
          type="button"
          className="nav__theme-toggle"
          onClick={onToggleTheme}
        >
          {darkMode ? "Light" : "Dark"}
        </button>
        {user ? (
          <>
            <span className="nav__user">{user.email}</span>
            <button className="nav__btn" onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav__link" to="/login">
              Login
            </Link>
            <Link className="nav__btn" to="/register">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;

