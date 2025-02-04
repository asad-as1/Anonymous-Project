import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookie from "cookies-js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Side from "../../components/Side/Side.jsx";
import "./Login.css";

function Login({ user }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/user/login`, data);
      if (res?.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Successfully Logged In",
          confirmButtonText: "OK",
        });
        Cookie.set("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="login-container">
      <Side />

      <div className="form-container">
        <div className="form-box">
          <div className="form-header">
            <h2>Login to your account</h2>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="form">
            <div className="form-group">
              <label>Username:</label>
              <input
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="error">{errors.username.message}</p>}
            </div>

            <div className="form-group">
              <label>Password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    validate: {
                      minLength: (value) =>
                        value.length >= 8 || "Password must be at least 8 characters",
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
                      hasSpecialChar: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Must contain at least one special character",
                      hasDigit: (value) =>
                        /\d/.test(value) || "Must contain at least one digit",
                    },
                  })}
                />
                <span onClick={togglePasswordVisibility} className="toggle-password">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            <button type="submit" className="submit-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
