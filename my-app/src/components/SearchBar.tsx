"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import RepoCard, { Repo } from "./RepoCard";

const RepoList = ({ data }: { data: Repo[] }) => {
  const [length, setlength] = useState(0);
  const [start, setstart] = useState(0);
  const [end, setend] = useState(10);

  useEffect(() => {
    setlength(data.length);
  }, [data]);

  const setPage = (n: number) => {
    setstart(n * 10);
    setend((n + 1) * 10);
  };

  const cardperpage = 10;
  const noofpages = Math.ceil(length / cardperpage);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {[...Array(noofpages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-sm sm:text-base"
          >
            {n}
          </button>
        ))}
      </div>
      {data.slice(start, end).map((element) =>
        element && element.owner ? (
          <RepoCard key={element.id} repo={element} />
        ) : null
      )}
    </div>
  );
};

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("");
  const [stars, setStars] = useState(0);
  const [topic, setTopic] = useState("");
  const [sort, setSort] = useState("stars");
  const [order, setOrder] = useState("desc");
  const [data, setData] = useState(null);

  const resetState = () => {
    setKeyword("");
    setLanguage("");
    setStars(0);
    setTopic("");
    setSort("stars");
    setOrder("desc");
  };

  const handleSearch = () => {
  let query = "";

  if (keyword) query += `${keyword} `;
  if (language) query += `language:${language} `;
  if (stars) query += `stars:>${stars} `;
  if (topic) query += `topic:${topic} `;
  
  query = query.trim();

  const params: Record<string, string|number> = {
    q: query || "stars:>1", 
    per_page: 100, 
  };
  
  if (sort) params.sort = sort;
  if (order) params.order = order;

  axios
    .get("https://api.github.com/search/repositories", { params })
    .then((response) => {
      console.log(response.data.items);
      setData(response.data.items);
      resetState();
    })
    .catch((error) => {
      console.error("GitHub API error:", error);
    });
};

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto border border-gray-200">
      <h1 className="text-2xl font-bold mb-2 text-center text-[#0969da]">
        Search GitHub Repositories
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center">
        Use the filters below to find repositories that match your interests. All fields are necessary.
      </p>
      <label className="text-sm text-gray-500 dark:text-gray-400 text-left w-full">
        keyword
      </label>
      <input
        type="text"
        placeholder="🔍 Keyword (e.g. react)"
        className="p-2 border border-gray-300 bg-gray-50 w-full rounded"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <label className="text-sm text-gray-500 dark:text-gray-400 text-left w-full">
        language
      </label>
      <input
        type="text"
        placeholder="💻 Language (e.g. javascript)"
        className="p-2 border border-gray-300 bg-gray-50 w-full rounded"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <label className="text-sm text-gray-500 dark:text-gray-400 text-left w-full">
        stars
      </label>
      <input
        type="number"
        placeholder="⭐ Min Stars (e.g. 1000)"
        className="p-2 border border-gray-300 bg-gray-50 w-full rounded"
        value={stars}
        onChange={(e) => setStars(Number(e.target.value))}
      />
      <label className="text-sm text-gray-500 dark:text-gray-400 text-left w-full">
        topic
      </label>
      <input
        type="text"
        placeholder="🏷 Topic (e.g. web3)"
        className="p-2 border border-gray-300 bg-gray-50 w-full rounded"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div className="flex gap-4 w-full">
        <select
          className="p-2 border border-gray-300 bg-gray-50 rounded w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="stars">Sort by Stars</option>
          <option value="forks">Sort by Forks</option>
          <option value="updated">Recently Updated</option>
        </select>

        <select
          className="p-2 border border-gray-300 bg-gray-50 rounded w-full"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">⬇ Descending</option>
          <option value="asc">⬆ Ascending</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="bg-[#2da44e] hover:bg-[#218739] text-white px-4 py-2 rounded transition w-full"
      >
        🔍 Search
      </button>

      <RepoList data={data || []} />
    </div>
  );
};

export default SearchBar;
