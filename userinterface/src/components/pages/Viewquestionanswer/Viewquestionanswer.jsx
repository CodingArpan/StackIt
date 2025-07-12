import React, { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Bell,
  User,
  Navigation,
  LogOut,
  Settings,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
export default function Viewquestionanswer() {
  const navigate = useNavigate();

  // User authentication state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: `<div>
        <p><strong>The || Operator.</strong></p>
        <p><strong>The + Operator.</strong></p>
        <p><strong>The CONCAT Function.</strong></p>
      </div>`,
      votes: 0,
      userVote: null, // null, 'up', or 'down'
    },
    {
      id: 2,
      content: `<div>
        <p><strong>Details</strong></p>
        <p>You can use the CONCAT function or the + operator to join columns in SQL. Here's an example:</p>
        <pre><code>SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;</code></pre>
      </div>`,
      votes: 0,
      userVote: null,
    },
  ]);

  const [newAnswer, setNewAnswer] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const editorRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("stackit.user");
    localStorage.removeItem("stackit.accessToken");
    setUser(null);
    setIsLoggedIn(false);
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
      setUser(null);
    }
  }, []);

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

  // Initialize Quill editor for new answer
  useEffect(() => {
    const loadQuill = async () => {
      if (!document.querySelector('link[href*="quill"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
        document.head.appendChild(link);
      }

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
              [{ size: ["small", false, "large", "huge"] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image"],
            ],
          },
          placeholder: "Write your answer here...",
        });

        quill.on("text-change", () => {
          setNewAnswer(quill.root.innerHTML);
        });
      }
    };

    loadQuill();
  }, []);

  const handleVote = (answerId, voteType) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) => {
        if (answer.id === answerId) {
          let newVotes = answer.votes;
          let newUserVote = voteType;

          // Handle vote logic
          if (answer.userVote === voteType) {
            // Remove vote if same vote clicked
            newUserVote = null;
            newVotes += voteType === "up" ? -1 : 1;
          } else if (answer.userVote === null) {
            // Add new vote
            newVotes += voteType === "up" ? 1 : -1;
          } else {
            // Change vote
            newVotes += voteType === "up" ? 2 : -2;
          }

          return {
            ...answer,
            votes: newVotes,
            userVote: newUserVote,
          };
        }
        return answer;
      })
    );
  };

  const handleSubmitAnswer = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (!newAnswer.trim() || newAnswer === "<p><br></p>") {
      alert("Please write an answer before submitting.");
      return;
    }

    const newAnswerObj = {
      id: answers.length + 1,
      content: newAnswer,
      votes: 0,
      userVote: null,
    };

    setAnswers([...answers, newAnswerObj]);
    setNewAnswer("");

    // Clear Quill editor
    if (editorRef.current && window.Quill) {
      const quill = window.Quill.find(editorRef.current);
      if (quill) {
        quill.setContents([]);
      }
    }

    // Show success message
    alert("Answer submitted successfully!");
  };

  //   const handleLogin = () => {
  //     setIsLoggedIn(true);
  //     setShowLoginPopup(false);
  //   };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
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
            {isLoggedIn && (
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 cursor-pointer hover:text-white" />
            )}
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
                    {user?.fullName}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-20">
                    <div className="px-4 py-3 border-b border-gray-600">
                      <p className="text-sm font-medium text-white">
                        {user?.fullName}
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

        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <div className="text-sm text-blue-400">
            <span className="text-gray-400">Question</span>
            <span className="mx-2"></span>
            <span>How to join 2......</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            How to join 2 columns in a data set to make a separate column in SQL
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-700 text-sm rounded-full">
              Tags
            </span>
            <span className="px-3 py-1 bg-gray-700 text-sm rounded-full">
              Tags
            </span>
          </div>

          <div className="text-gray-300 text-sm sm:text-base">
            <p>
              I do not know the code for it as I am a beginner. As an example
              what I need to do is like there is a column 1 containing First
              name, and column 2 consists of last name I want a column to
              combine
            </p>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Answers</h3>

          {answers.map((answer, index) => (
            <div
              key={answer.id}
              className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 flex"
            >
              {/* Voting Section */}
              <div className="flex flex-col items-center mr-4 sm:mr-6">
                <button
                  onClick={() => handleVote(answer.id, "up")}
                  className={`p-2 rounded-full transition-colors ${
                    answer.userVote === "up"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <span className="text-lg sm:text-xl font-semibold my-2">
                  {answer.votes}
                </span>

                <button
                  onClick={() => handleVote(answer.id, "down")}
                  className={`p-2 rounded-full transition-colors ${
                    answer.userVote === "down"
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Answer Content */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-sm sm:text-base font-medium">
                    Answer {index + 1}
                  </span>
                </div>
                <div
                  className="prose prose-invert max-w-none text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Your Answer Section */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Submit Your Answer
          </h3>

          <div className="mb-4">
            <div className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
              <div ref={editorRef} style={{ minHeight: "200px" }}></div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleSubmitAnswer}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Login Popup */}
        {showLoginPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Login Required</h3>
              <p className="text-gray-300 mb-4">
                You need to be logged in to vote on answers or submit your own
                answer.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate("/auth/signin")}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Instructions */}
        <div className="mt-6 text-xs sm:text-sm text-gray-400 space-y-1">
          <p>
            • If not login then not able to do vote (show a quick login/signup
            popup)
          </p>
          <p>• No multiple votes allowed</p>
          <p>• User can up-vote answer (once per user)</p>
        </div>
      </div>

      {/* Custom Quill Styles */}
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

        .prose h1,
        .prose h2,
        .prose h3 {
          color: #ffffff !important;
        }

        .prose p {
          color: #d1d5db !important;
        }

        .prose strong {
          color: #ffffff !important;
        }

        .prose pre {
          background-color: #111827 !important;
          color: #d1d5db !important;
        }

        .prose code {
          background-color: #111827 !important;
          color: #d1d5db !important;
        }
      `}</style>
    </div>
  );
}
