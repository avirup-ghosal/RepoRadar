"use client";
export type Repo = {
  id: number;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
};

const RepoCard = ({ repo }: { repo: Repo }) => {
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

      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-white text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
      >
        🔍 Explore Repository
      </a>
    </div>
  );
};

export default RepoCard;
