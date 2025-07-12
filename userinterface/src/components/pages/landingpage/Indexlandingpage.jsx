import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  ArrowUp,
  MessageSquare,
  Check,
  User,
  LogOut,
  Settings,
} from "lucide-react";

export default function Indexlandingpage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [UserID, setUserID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("stackit.user");
    localStorage.removeItem("stackit.accessToken");
    setIsLoggedIn(false);
    setUser(null);
    setUserID("");
    navigate("/auth/signin");
  };

  useEffect(() => {
    const userData = window.localStorage.getItem("stackit.user");
    const accessToken = window.localStorage.getItem("stackit.accessToken");
    if (userData && accessToken) {
      const userObj = JSON.parse(userData);
      setUserID(userObj.id);
      setUser(userObj);
      setIsLoggedIn(true);
    } else {
      window.localStorage.setItem("stackit.user", "");
      window.localStorage.setItem("stackit.accessToken", "");
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

  // Function to fetch questions from the API
  const fetchQuestions = async (page = 1, sort = "Newest", search = "") => {
    try {
      setLoading(true);
      setError("");

      // Map frontend sort options to backend format
      const sortMapping = {
        Newest: "recent",
        Popular: "popular",
        Views: "views",
        Votes: "votes",
      };

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort: sortMapping[sort] || "recent",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `http://localhost:3000/api/questions?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions || []);
        setPagination(
          data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalQuestions: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } else {
        setError(data.message || "Failed to fetch questions");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Fetch questions error:", error);
      setError("Network error. Please check your connection and try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch questions on component mount and when filters change
  useEffect(() => {
    fetchQuestions(currentPage, sortBy, searchTerm);
  }, [currentPage, sortBy, searchTerm]);

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

  const sortOptions = ["Newest", "Popular", "Views", "Votes"];
  const filterOptions = ["Filters", "Newest", "Popular", "Views", "Votes"];

  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;

    // Show first page
    if (totalPages > 0) {
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          1
        </button>
      );
    }

    // Show dots if needed
    if (currentPage > 3) {
      pages.push(
        <span key="dots-start" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === i
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {i}
          </button>
        );
      }
    }

    // Show dots if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots-end" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    // Show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  // Handle search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1); // Always reset to first page when searching
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]); // Only depend on searchTerm to avoid infinite loops

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-gray-800 px-6 py-4 hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">StackIt</h1>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative account-dropdown">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">{user?.username}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
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
              onClick={() => {
                navigate("/auth/signin");
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <header className="bg-gray-800 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">StackIt</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="relative"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            {isLoggedIn ? (
              <div className="relative account-dropdown">
                <button
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <User className="w-4 h-4 text-white" />
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-30">
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
                onClick={() => {
                  navigate("/auth/signin");
                }}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        <button
          onClick={() => navigate("/ask-new-question")}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm mb-3"
        >
          Ask New question
        </button>

        {isFiltersOpen && (
          <div className="absolute right-4 top-20 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 w-48">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  handleSortChange(option);
                  setIsFiltersOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-sm hover:bg-gray-700 border-b border-gray-600 last:border-b-0"
              >
                <span>{option}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="px-4 md:px-6 py-4 md:py-6">
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/ask-new-question")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              Ask New question
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
              >
                <span>{sortBy}</span>
                <span className="text-xs">Unanswered</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleSortChange(option);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-2 text-gray-400">Loading questions...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
            {error}
            <button
              onClick={() => fetchQuestions(currentPage, sortBy, searchTerm)}
              className="ml-2 text-blue-400 hover:text-blue-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* No Questions State */}
        {!loading && !error && questions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-sm">
                {searchTerm
                  ? `No questions match "${searchTerm}". Try a different search term.`
                  : "Be the first to ask a question!"}
              </p>
            </div>
            <button
              onClick={() => navigate("/ask-new-question")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              Ask New Question
            </button>
          </div>
        )}

        {/* Questions List */}
        {!loading && !error && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question._id}
                className="border border-gray-700 rounded-lg p-3 md:p-4 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/view-question/${question._id}`)}
              >
                <div className="md:hidden">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex flex-col items-center space-y-1 text-xs text-gray-400 mt-1">
                      <ArrowUp className="w-4 h-4" />
                      <span>{question.votes || 0}</span>
                      {question.isResolved && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-400 hover:text-blue-300 mb-2">
                        {question.title}
                      </h3>
                      <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                        {question.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {question.tags &&
                          question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {question.authorUsername || question.author?.username}
                        </span>
                        <span>{formatTimeAgo(question.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-blue-400 hover:text-blue-300">
                      {question.title}
                    </h3>
                    <span className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">
                      {formatTimeAgo(question.createdAt)}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {question.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {question.tags &&
                          question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {question.authorUsername || question.author?.username}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{question.votes || 0} votes</span>
                      <span>{question.answersCount || 0} answers</span>
                      <span>{question.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading &&
          !error &&
          questions.length > 0 &&
          pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 md:mt-8 space-x-1 md:space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {renderPageNumbers()}

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage === pagination.totalPages}
                className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
      </main>

      <div className="fixed bottom-4 left-4 text-gray-500 text-xs md:hidden">
        Should Also compatible with mobile
      </div>
    </div>
  );
}
