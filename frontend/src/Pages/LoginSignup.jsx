import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Backend server is not reachable");
    }
  };

  const signup = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Backend server is not reachable");
    }
  };

  return (
    <div className="loginsignup-container-wrapper">
      <div className="loginsignup-form-area">
        <p className="loginsignup-title">{state === "Login" ? "LOGIN" : "SIGN UP"}</p>

        <form onSubmit={(e) => e.preventDefault()}>
          {state === "Sign Up" && (
            <div className="loginsignup-group">
              <label className="loginsignup-subtitle">Name</label>
              <input
                className="loginsignup-input"
                name="username"
                value={formData.username}
                onChange={changeHandler}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="loginsignup-group">
            <label className="loginsignup-subtitle">Email</label>
            <input
              className="loginsignup-input"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              placeholder="Enter your email"
            />
          </div>

          <div className="loginsignup-group">
            <label className="loginsignup-subtitle">Password</label>
            <input
              className="loginsignup-input"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Enter your password"
            />
          </div>

          <div className="loginsignup-agree">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree">I agree to the terms of use and privacy policy</label>
          </div>

          <button
            className="loginsignup-btn"
            onClick={() => (state === "Login" ? login() : signup())}
          >
            {state === "Login" ? "LOGIN" : "SIGN UP"}
          </button>

          <p>
            {state === "Login" ? "Don't have an account?" : "Have an Account?"}{" "}
            <span
              className="loginsignup-link"
              onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
            >
              {state === "Login" ? "Sign Up Here" : "Login Here"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;