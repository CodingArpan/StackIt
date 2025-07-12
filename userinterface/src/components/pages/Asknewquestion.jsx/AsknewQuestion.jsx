import React, { useState, useRef, useEffect } from "react";

export default function StackItForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const editorRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { title, description, tags });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-2xl font-bold">StackIt</h1>
            <span className="text-gray-400 text-sm sm:text-base hidden sm:inline">
              Screen 2
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-gray-300 hover:text-white text-sm sm:text-base">
              Home
            </button>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded"></div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded"></div>
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
