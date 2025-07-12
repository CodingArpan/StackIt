import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Github,
  Chrome,
  ArrowLeft,
  Check,
} from "lucide-react";

const Signuppage = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(""); // "checking", "available", "taken", "invalid"
  const [usernameMessage, setUsernameMessage] = useState("");

  // Function to check if username is available
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      return {
        available: false,
        message: "Username must be at least 3 characters long",
      };
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/check-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      const data = await response.json();
      return { available: data.success, message: data.message };
    } catch (error) {
      console.error("Username check error:", error);
      return {
        available: false,
        message: "Failed to check username availability",
      };
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError("");
    setSuccess("");

    if (
      !signupData.fullName ||
      !signupData.username ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check username availability
    const usernameCheck = await checkUsernameAvailability(signupData.username);
    if (!usernameCheck.available) {
      setError(usernameCheck.message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: signupData.fullName,
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Account created successfully! Redirecting...");
        // Store the token in localStorage for future requests
        localStorage.setItem("stackit.accessToken", data.data.accessToken);
        localStorage.setItem("stackit.user", JSON.stringify(data.data.user));

        // Immediate redirect - much faster!
        navigate("/", { replace: true });
      } else {
        // Handle validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(data.message || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // Debounced username check effect
  useEffect(() => {
    if (!signupData.username) {
      setUsernameStatus("");
      setUsernameMessage("");
      return;
    }

    if (signupData.username.length < 3) {
      setUsernameStatus("invalid");
      setUsernameMessage("Username must be at least 3 characters long");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(signupData.username)) {
      setUsernameStatus("invalid");
      setUsernameMessage(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    setUsernameStatus("checking");
    setUsernameMessage("Checking availability...");

    const timeoutId = setTimeout(async () => {
      const result = await checkUsernameAvailability(signupData.username);
      if (result.available) {
        setUsernameStatus("available");
        setUsernameMessage("Username is available!");
      } else {
        setUsernameStatus("taken");
        setUsernameMessage(result.message);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [signupData.username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Signup Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Back Button */}
          <button
            onClick={() => navigate("/auth/signin")}
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Join us and start your journey today
            </p>
          </div>

          {/* Signup Form */}
          <form className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="fullName"
                value={signupData.fullName}
                onChange={handleSignupChange}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Username */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Username Status Message */}
            {usernameStatus && (
              <div
                className={`text-sm rounded-2xl p-4 mb-4 transition-all duration-300 ${
                  usernameStatus === "available"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : usernameStatus === "taken"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                    : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                }`}
              >
                {usernameMessage}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignupSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/signin")}
                className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Floating Success Icon */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Check className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Signuppage;
