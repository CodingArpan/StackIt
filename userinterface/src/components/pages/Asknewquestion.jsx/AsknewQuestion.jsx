import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function AsknewQuestion() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const editorRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("stackit.user");
    localStorage.removeItem("stackit.accessToken");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/auth/signin");
  };

  // Check authentication status
  useEffect(() => {
    const userData = window.localStorage.getItem("stackit.user");
    const accessToken = window.localStorage.getItem("stackit.accessToken");
    if (userData && accessToken) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/auth/signin");
    }
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountDropdownOpen && !event.target.closest(".account-dropdown")) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountDropdownOpen]);

  // Initialize Quill editor
  useEffect(() => {
    // Load Quill CSS and JS
    const loadQuill = async () => {
      // Add Quill CSS
      if (!document.querySelector('link[href*="quill"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
        document.head.appendChild(link);
      }

      // Load Quill JS
      if (!window.Quill) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
        script.onload = initializeQuill;
        document.head.appendChild(script);
      } else {
        initializeQuill();
      }
    };

    const initializeQuill = () => {
      if (editorRef.current && window.Quill) {
        const quill = new window.Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image", "video"],
            ],
          },
          placeholder: "Describe your question in detail...",
        });

        // Update state when content changes
        quill.on("text-change", () => {
          setDescription(quill.root.innerHTML);
        });

        // Apply dark theme styles
        const editor = editorRef.current;
        if (editor) {
          editor.querySelector(".ql-editor").style.backgroundColor = "#1f2937";
          editor.querySelector(".ql-editor").style.color = "#ffffff";
          editor.querySelector(".ql-editor").style.border = "none";
          editor.querySelector(".ql-toolbar").style.backgroundColor = "#374151";
          editor.querySelector(".ql-toolbar").style.borderColor = "#4b5563";
        }
      }
    };

    loadQuill();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      alert("Please enter a title for your question");
      return;
    }

    if (!description.trim()) {
      alert("Please provide a description for your question");
      return;
    }

    // Get auth token
    const accessToken = localStorage.getItem("stackit.accessToken");
    if (!accessToken) {
      alert("Please login to ask a question");
      navigate("/auth/signin");
      return;
    }

    try {
      const questionData = {
        title: title.trim(),
        description: description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      console.log("Submitting question:", questionData);

      // Make API call to create question
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(questionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit question");
      }

      alert("Question submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Failed to submit question. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-2xl font-bold">StackIt</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-300 hover:text-white text-sm sm:text-base"
            >
              Home
            </button>
            {isLoggedIn ? (
              <div className="relative account-dropdown">
                <button
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:block">
                    {user?.username}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-20">
                    <div className="px-4 py-3 border-b border-gray-600">
                      <p className="text-sm font-medium text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        // Navigate to profile
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        // Navigate to settings
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 border-t border-gray-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth/signin")}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl mb-4 sm:mb-6">Ask Question</h2>

        {/* Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your question title..."
            />
          </div>

          {/* Description with Quill Rich Text Editor */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>

            {/* Quill Editor Container */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
              <div ref={editorRef} style={{ minHeight: "200px" }}></div>
            </div>

            {/* HTML Rich Text Indicator */}
            <div className="text-xs text-gray-400 mt-1 text-right">
              HTML Rich Text Editor
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter tags separated by commas (e.g., react, javascript, help)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2 sm:pt-0">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Custom styles for Quill dark theme */}
      <style jsx>{`
        .ql-toolbar {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
          border-bottom: 1px solid #4b5563 !important;
        }

        .ql-toolbar .ql-stroke {
          stroke: #d1d5db !important;
        }

        .ql-toolbar .ql-fill {
          fill: #d1d5db !important;
        }

        .ql-toolbar .ql-picker-label {
          color: #d1d5db !important;
        }

        .ql-toolbar button:hover {
          background-color: #4b5563 !important;
        }

        .ql-toolbar button.ql-active {
          background-color: #6b7280 !important;
        }

        .ql-editor {
          background-color: #1f2937 !important;
          color: #ffffff !important;
          border: none !important;
          min-height: 200px !important;
        }

        .ql-editor::before {
          color: #9ca3af !important;
        }

        .ql-container {
          border-color: #4b5563 !important;
        }

        .ql-picker-options {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }

        .ql-picker-item {
          color: #d1d5db !important;
        }

        .ql-picker-item:hover {
          background-color: #4b5563 !important;
        }

        @media (max-width: 640px) {
          .ql-toolbar {
            padding: 4px !important;
          }

          .ql-toolbar button {
            width: 24px !important;
            height: 24px !important;
          }

          .ql-editor {
            min-height: 150px !important;
          }
        }
      `}</style>
    </div>
  );
}
