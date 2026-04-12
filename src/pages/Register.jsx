import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { register as registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");
      await registerUser(data);

      // Redirect to login after successful registration
      navigate("/login");
    } catch (error) {
      setErrorMsg(error?.message || "Registration failed");
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
          
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              {...register("fullName", { required: "Full Name is required" })}
            />
            {errors.fullName && (
              <small className="text-danger">{errors.fullName.message}</small>
            )}
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <small className="text-danger">{errors.username.message}</small>
            )}
          </div>

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
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;