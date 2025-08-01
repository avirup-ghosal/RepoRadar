import React from "react";

export const metadata = {
  title: "About | RepoRadar",
  description:
    "Learn more about RepoRadar – a powerful GitHub repository explorer that uses AI to analyze and summarize projects for developers.",
};

const AboutPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-900 bg-white">
      <h1 className="text-4xl font-bold mb-6 text-black">About RepoRadar</h1>

      <p className="text-lg mb-6 leading-relaxed text-gray-700">
        RepoRadar is a web-based application that enables developers to
        search, filter, and explore open-source repositories from GitHub using
        a clean and responsive UI. Whether you&apos;re looking for trending
        projects, tech stacks, or inspiration, RepoRadar gives you a
        powerful and simple interface to do it.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">✨ Key Features</h2>
      <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
        <li>
          <strong>Advanced Search:</strong> Filter by keywords, language,
          stars, topics, and more.
        </li>
        <li>
          <strong>AI-Powered Summaries:</strong> Automatically summarize
          README files to help beginners understand projects faster.
        </li>
        <li>
          <strong>Responsive Design:</strong> Optimized for all screen sizes using Tailwind CSS.
        </li>
        <li>
          <strong>Powered by GitHub API:</strong> Real-time data fetched directly from GitHub&apos;s REST API.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-black">Who is it for?</h2>
      <p className="text-base leading-relaxed mb-6 text-gray-700">
        RepoRadar is ideal for:
      </p>
      <ul className="list-disc list-inside space-y-2 text-base mb-4 text-gray-700">
        <li>Students and beginners trying to understand open-source projects</li>
        <li>Developers searching for starter repos or tech inspiration</li>
        <li>Teams wanting to quickly evaluate project quality and structure</li>
      </ul>

      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} RepoRadar. Built using
        Next.js, Tailwind CSS, and Gemini API.
      </p>
    </main>
  );
};

export default AboutPage;
