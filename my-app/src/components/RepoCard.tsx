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
const Popup=({data,setPopupData}:{data:string,setPopupData:(data:string|null)=>void})=>{
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
}
const RepoCard = ({ repo }: { repo: Repo }) => {
  const [popupData, setPopupData] = useState<string | null>(null);
  if (!repo || !repo.owner) {
  return null; 
}
    return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow hover:shadow-lg transition w-full max-w-md bg-white">
      <div className="flex items-center gap-4 flex-wrap">
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
      <div>⭐stars: {repo.stargazers_count} 🍴forks: {repo.forks_count}</div>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-white text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
      >
        🔍 Explore Repository
      </a>
      <button
        onClick={async () => {
          console.log(`Requesting AI analysis for ${repo.full_name}`);
          const res=await axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`)
          repo.readme = res.data.content ? Buffer.from(res.data.content, 'base64').toString('utf-8') : "No README available.";
          const response = await axios.post("/api/gemini", {
            prompt: `
Here's a GitHub repository:
- Name: ${repo.full_name}
- Description: ${repo.description || "No description provided."}
- Stars: ${repo.stargazers_count}
- Primary Language: ${repo.language || "Unknown"}
- README:\n${repo.readme || "No README available."}

Can you summarize this repository for a beginner developer?
`
          });
          setPopupData(response.data.text);
        }}
        className="inline-block text-white text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
      >
        ✨ Analyze with AI
      </button>
      {popupData && (
        <Popup data={popupData} setPopupData={setPopupData} />
      )}
    </div>
  );
};

export default RepoCard;

