import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth">
      <h1>Create account</h1>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="auth__input"
          type="password"
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="auth__error">{error}</p>}
        <button className="auth__btn" type="submit">
          Sign Up
        </button>
      </form>
      <p className="auth__switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </main>
  );
}

export default Register;
