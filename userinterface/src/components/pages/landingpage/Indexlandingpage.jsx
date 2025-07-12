import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  ArrowUp,
  MessageSquare,
  Check,
} from "lucide-react";

export default function Indexlandingpage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const questions = [
    {
      id: 1,
      title:
        "How to join 2 columns in a data set to make a separate column in SQL",
      description:
        "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...",
      user: "User Name",
      tags: ["Tags", "Tags"],
      timeAgo: "5 ans",
      answers: 0,
      votes: 0,
    },
    {
      id: 2,
      title: "Question.....",
      description: "Descriptions....",
      user: "User Name",
      tags: ["Tags", "Tags"],
      timeAgo: "3 ans",
      answers: 0,
      votes: 0,
    },
    {
      id: 3,
      title: "Question.....",
      description: "Descriptions....",
      user: "User Name",
      tags: ["Tags", "Tags"],
      timeAgo: "2 ans",
      answers: 0,
      votes: 0,
    },
  ];

  const sortOptions = ["Newest", "Unanswered", "Active", "Votes"];
  const filterOptions = ["Filters", "Newest", "Unanswered", "More"];

  const totalPages = 7;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
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
    return pages;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-gray-800 px-6 py-4 hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">StackIt</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              navigation.navigate("/auth/signin");
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm"
          >
            Login
          </button>
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
            <button
              onClick={() => {
                navigation.navigate("/auth/signin");
              }}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full text-sm"
            >
              Login
            </button>
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

        <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm mb-3">
          Ask New question
        </button>

        {isFiltersOpen && (
          <div className="absolute right-4 top-20 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 w-48">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSortBy(option);
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
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
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
                        setSortBy(option);
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

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-700 rounded-lg p-3 md:p-4 hover:border-gray-600 transition-colors"
            >
              <div className="md:hidden">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex flex-col items-center space-y-1 text-xs text-gray-400 mt-1">
                    <ArrowUp className="w-4 h-4" />
                    <span>{question.votes}</span>
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-400 hover:text-blue-300 cursor-pointer mb-2">
                      {question.title}
                    </h3>
                    <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                      {question.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{question.user}</span>
                      <span>{question.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-blue-400 hover:text-blue-300 cursor-pointer">
                    {question.title}
                  </h3>
                  <span className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">
                    {question.timeAgo}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {question.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {question.user}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{question.votes} votes</span>
                    <span>{question.answers} answers</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <div className="fixed bottom-4 left-4 text-gray-500 text-xs md:hidden">
        Should Also compatible with mobile
      </div>
    </div>
  );
}
