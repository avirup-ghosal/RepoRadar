"use client";

import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export type Repo = {
  id: number;
  full_name: string;
  name: string;
  language: string;
  readme?: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
};

// Popup component stays unchanged
const Popup = ({
  data,
  setPopupData,
}: {
  data: string;
  setPopupData: (data: string | null) => void;
}) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">AI Analysis</h3>
        <div className="prose max-w-none text-sm text-gray-700">
          <ReactMarkdown>{data}</ReactMarkdown>
        </div>
        <button
          onClick={() => setPopupData(null)}
          className="mt-6 w-full text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const RepoCard = ({ repo }: { repo: Repo }) => {
  const [popupData, setPopupData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!repo || !repo.owner) return null;

  const handleAIAnalysis = async () => {
    try {
      setLoading(true);
      console.log(`Requesting AI analysis for ${repo.full_name}`);

      // Fetch README from GitHub
      const res = await axios.get(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`
      );

      const readme = res.data.content
        ? Buffer.from(res.data.content, "base64").toString("utf-8")
        : "No README available.";

      // Basic sanitization — strips code blocks and role-injection markers
      const sanitizedReadme = readme
        .replace(/```.*?```/gs, "[code removed]")
        .replace(/(system:|user:|assistant:)/gi, "[role removed]")
        .slice(0, 5000);

      // 🔒 Send only structured data — backend will build the full prompt
      const response = await axios.post("/api/gemini", {
       repoData: {
    full_name: repo.full_name,
    description: repo.description,
    stars: repo.stargazers_count, // ✅ match backend field name
    language: repo.language,
    readme: sanitizedReadme,
  },
      });

      setPopupData(response.data.text);
    } catch (error) {
      console.error("Error during AI analysis:", error);
      alert("Something went wrong while analyzing the repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow hover:shadow-lg transition w-full max-w-md bg-white">
      <div className="flex items-center gap-4 flex-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={repo.owner.avatar_url}
          alt={`${repo.owner.login}'s avatar`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold break-words">{repo.full_name}</h2>
      </div>

      <div className="flex justify-between w-full text-sm text-gray-600">
        <span>👤 {repo.owner.login}</span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          🔗 View Repo
        </a>
      </div>

      <p className="text-gray-700 text-sm">
        {repo.description || "No description provided."}
      </p>
      <div>
        ⭐ stars: {repo.stargazers_count} 🍴 forks: {repo.forks_count}
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-white text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
      >
        🔍 Explore Repository
      </a>

      <button
        onClick={handleAIAnalysis}
        disabled={loading}
        className={`inline-block text-white text-sm ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } px-4 py-2 rounded transition flex items-center justify-center`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
            Analyzing...
          </>
        ) : (
          "✨ Analyze with AI"
        )}
      </button>

      {popupData && <Popup data={popupData} setPopupData={setPopupData} />}
    </div>
  );
};

export default RepoCard;
