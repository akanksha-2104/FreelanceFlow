import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { login as loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");

      const response = await loginUser(data);
      console.log("Full response.data:", response);
        console.log("Type of response.data:", typeof response);

      // Extract token (adjust key if backend differs)
      const token = response.token;

      // Save token in context + localStorage
      login(token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
      // Redirect to dashboard
      // navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error?.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        
        {/* App Name */}
        <h3 className="text-center mb-4">FreelanceFlow</h3>

        {/* Error Alert */}
        {errorMsg && (
          <div className="alert alert-danger">{errorMsg}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-3">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;