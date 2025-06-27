"use client";
import axios from "axios";
import { useState } from "react";
import RepoCard, { Repo } from "./RepoCard";
const RepoList = ({ data }: { data: Repo[] }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {data.map((element) => (
        element && element.owner ? <RepoCard key={element.id} repo={element} /> : null
      ))}
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
  const resetState=()=>{
    setKeyword("");
    setLanguage("");
    setStars(0);
    setTopic("");
    setSort("stars");
    setOrder("desc");
  }
  const handleSearch = () => {
    axios
      .get("https://api.github.com/search/repositories", {
        params: {
          q: `${keyword} language:${language} stars:>${stars} topic:${topic}`,
          sort,
          order,
        },
      })
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
    <div className="flex flex-col gap-4 items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-center">
        Search GitHub Repositories
      </h1>

      <input
        type="text"
        placeholder="🔍 Keyword (e.g. react)"
        className="p-2 border w-full rounded"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <input
        type="text"
        placeholder="💻 Language (e.g. javascript)"
        className="p-2 border w-full rounded"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />

      <input
        type="number"
        placeholder="⭐ Min Stars (e.g. 1000)"
        className="p-2 border w-full rounded"
        value={stars}
        onChange={(e) => setStars(Number(e.target.value))}
      />

      <input
        type="text"
        placeholder="🏷 Topic (e.g. web3)"
        className="p-2 border w-full rounded"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div className="flex gap-4 w-full">
        <select
          className="p-2 border rounded w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="stars">Sort by Stars</option>
          <option value="forks">Sort by Forks</option>
          <option value="updated">Recently Updated</option>
        </select>

        <select
          className="p-2 border rounded w-full"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">⬇ Descending</option>
          <option value="asc">⬆ Ascending</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        🔍 Search
      </button>
      <RepoList data={data || []} />
    </div>
  );
};

export default SearchBar;
