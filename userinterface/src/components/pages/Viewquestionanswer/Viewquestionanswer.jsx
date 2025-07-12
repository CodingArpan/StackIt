import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Bell,
  User,
  Navigation,
  LogOut,
  Settings,
  ChevronDown as ChevronDownIcon,
  MessageSquare,
  Eye,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
export default function Viewquestionanswer() {
  const navigate = useNavigate();
  const { id } = useParams();

  // User authentication state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Question and answers state
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

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

  // Function to fetch answers for the question
  const fetchAnswers = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/answers/question/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAnswers(data.data.answers || []);
      } else {
        console.error("Failed to fetch answers:", data.message);
        setAnswers([]);
      }
    } catch (error) {
      console.error("Fetch answers error:", error);
      setAnswers([]);
    }
  }, [id]);

  // Function to fetch question details
  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:3000/api/questions/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setQuestion(data.data.question);
        // If the question already has answers populated, use them
        if (
          data.data.question.answers &&
          data.data.question.answers.length > 0
        ) {
          setAnswers(data.data.question.answers);
        } else {
          // Otherwise, fetch answers separately
          await fetchAnswers();
        }
      } else {
        setError(data.message || "Failed to fetch question");
      }
    } catch (error) {
      console.error("Fetch question error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [id, fetchAnswers]);

  // Function to format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 30)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
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

  // Fetch question data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      fetchQuestion();
    }
  }, [id, fetchQuestion]);

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
    const initQuill = () => {
      // Load Quill CSS
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
        script.onload = () => createEditor();
        document.head.appendChild(script);
      } else {
        createEditor();
      }
    };

    const createEditor = () => {
      if (
        editorRef.current &&
        window.Quill &&
        !editorRef.current.quillInstance
      ) {
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

        // Store quill instance
        editorRef.current.quillInstance = quill;
      }
    };

    if (question && !loading) {
      setTimeout(initQuill, 200);
    }
  }, [question, loading]);

  const handleVote = async (answerId, voteType) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const accessToken = localStorage.getItem("stackit.accessToken");
      const response = await fetch(
        `http://localhost:3000/api/answers/${answerId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ voteType }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) => {
            if (answer._id === answerId) {
              return {
                ...answer,
                votes: data.data.votes,
                userVote: data.data.userVote,
              };
            }
            return answer;
          })
        );
      } else {
        alert(data.message || "Failed to vote on answer");
      }
    } catch (error) {
      console.error("Vote error:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (!newAnswer.trim()) {
      alert("Please write an answer before submitting.");
      return;
    }

    try {
      setAnswerLoading(true);
      const accessToken = localStorage.getItem("stackit.accessToken");

      const response = await fetch(`http://localhost:3000/api/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: newAnswer,
          questionId: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new answer to the local state
        setAnswers((prevAnswers) => [...prevAnswers, data.data.answer]);
        setNewAnswer("");

        // Clear Quill editor
        if (editorRef.current && editorRef.current.quillInstance) {
          editorRef.current.quillInstance.setContents([]);
        }

        alert("Answer submitted successfully!");
      } else {
        alert(data.message || "Failed to submit answer");
      }
    } catch (error) {
      console.error("Submit answer error:", error);
      alert("Network error. Please try again.");
    } finally {
      setAnswerLoading(false);
    }
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
            <span>
              {question?.title
                ? question.title.substring(0, 30) + "..."
                : "Loading..."}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-2 text-gray-400">Loading question...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center mb-6">
            {error}
            <button
              onClick={fetchQuestion}
              className="ml-2 text-blue-400 hover:text-blue-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Question */}
        {!loading && !error && question && (
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                {question.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{question.views || 0} views</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatTimeAgo(question.createdAt)}</span>
                </div>
              </div>
            </div>

            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base mb-4"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-4">
                <span>{question.votes || 0} votes</span>
                <span>{question.answersCount || 0} answers</span>
              </div>
              <div className="text-right">
                <p>
                  Asked by{" "}
                  <span className="text-blue-400">
                    {question.authorUsername || question.author?.username}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Answers Section */}
        {!loading && !error && question && (
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {answers.length} Answer{answers.length !== 1 ? "s" : ""}
            </h3>

            {answers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">0 answers found</h3>
                  <p className="text-sm">
                    Be the first to answer this question!
                  </p>
                </div>
              </div>
            ) : (
              answers.map((answer, index) => (
                <div
                  key={answer._id}
                  className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 flex"
                >
                  {/* Voting Section */}
                  <div className="flex flex-col items-center mr-4 sm:mr-6">
                    <button
                      onClick={() => handleVote(answer._id, "up")}
                      className={`p-2 rounded-full transition-colors ${
                        answer.userVote === "up"
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <span className="text-lg sm:text-xl font-semibold my-2">
                      {answer.votes || 0}
                    </span>

                    <button
                      onClick={() => handleVote(answer._id, "down")}
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm sm:text-base font-medium">
                        Answer {index + 1}
                      </span>
                      <div className="text-sm text-gray-400">
                        by{" "}
                        <span className="text-blue-400">
                          {answer.authorUsername || answer.author?.username}
                        </span>
                        <span className="mx-2">•</span>
                        {formatTimeAgo(answer.createdAt)}
                      </div>
                    </div>
                    <div
                      className="prose prose-invert max-w-none text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Submit Your Answer Section */}
        {!loading && question && (
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Submit Your Answer
            </h3>

            {!isLoggedIn ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  You need to be logged in to submit an answer.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate("/auth/signin")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/auth/signup")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
                    <div ref={editorRef} style={{ minHeight: "200px" }}></div>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={answerLoading}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                  >
                    {answerLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

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

        /* Quill content styling for answers and questions */
        .ql-align-center {
          text-align: center !important;
        }

        .ql-align-left {
          text-align: left !important;
        }

        .ql-align-right {
          text-align: right !important;
        }

        .ql-align-justify {
          text-align: justify !important;
        }

        .ql-font-serif {
          font-family: Georgia, Times, serif !important;
        }

        .ql-font-monospace {
          font-family: Monaco, Courier, monospace !important;
        }

        .ql-size-small {
          font-size: 0.75em !important;
        }

        .ql-size-large {
          font-size: 1.5em !important;
        }

        .ql-size-huge {
          font-size: 2.5em !important;
        }

        .ql-indent-1 {
          padding-left: 3em !important;
        }

        .ql-indent-2 {
          padding-left: 6em !important;
        }

        .ql-indent-3 {
          padding-left: 9em !important;
        }

        .ql-cursor {
          display: none !important;
        }

        /* Additional Quill formatting */
        strong {
          font-weight: bold !important;
          color: #ffffff !important;
        }

        em {
          font-style: italic !important;
        }

        u {
          text-decoration: underline !important;
        }

        s {
          text-decoration: line-through !important;
        }

        sub {
          vertical-align: sub !important;
          font-size: smaller !important;
        }

        sup {
          vertical-align: super !important;
          font-size: smaller !important;
        }

        blockquote {
          border-left: 4px solid #6b7280 !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: #d1d5db !important;
        }

        ol {
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        ul {
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        li {
          margin: 0.5rem 0 !important;
          color: #d1d5db !important;
        }
      `}</style>
    </div>
  );
}
