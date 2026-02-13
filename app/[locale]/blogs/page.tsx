"use client";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

const BlogMainPage = () => {
  const router = useRouter();
  const posts = [
    {
      id: 1,
      title: "RRULE Todo Scheduling System — Instance Semantics & Overrides",
      excerpt:
        "This document defines the source of truth, data invariants, and instance-move semantics for the RRULE-based todo scheduling system. It follows RFC 5545 iCalendar behavior, adapted to this project's schema and constraints.",
      date: "2024-12-14",
      readTime: "8 min read",
      category: "documentation",
      slug: "RRULE_todo_scheduling_system",
    },
    {
      id: 2,
      title: "Drifting instanceDate problem",
      excerpt:
        " instanceDate is the occurrence date of a naturally generated todo. It is a crucial piece of information used to connect together the todo overrides with its generated instances.",
      date: "2024-12-08",
      readTime: "6 min read",
      category: "documentation",
      slug: "instanceDate_drifting_problem",
    },
  ];

  const categories = ["All"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-32">
        {/* Header */}
        <header className="mb-20">
          <h1
            className="font-serif text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Sanity Blog
          </h1>
          <p className="text-lg font-light tracking-wide opacity-70"></p>
        </header>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-lime text-white shadow-xs"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-0">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group border-b border-opacity-20 py-10 cursor-pointer transition-all duration-300"
              onClick={() => {
                // In Next.js, you would use: router.push(`/blog/${post.slug}`)
                console.log(`Navigate to /blog/${post.slug}`);
                router.push(`/blogs/page/${post.slug}`);
              }}
            >
              {/* Post Meta */}
              <div className="flex items-center gap-3 mb-3 text-sm">
                <span className="font-light opacity-60">{post.date}</span>
                <span className="opacity-30">•</span>
                <span className="font-light opacity-60">{post.readTime}</span>
                <span className="opacity-30">•</span>
                <span className="text-accent font-medium">{post.category}</span>
              </div>

              {/* Post Title */}
              <h2
                className="text-2xl md:text-3xl font-serif font-bold mb-3 tracking-tight transition-colors duration-300"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                {post.title}
              </h2>

              {/* Post Excerpt */}
              <p className="leading-relaxed mb-4 opacity-70 transition-opacity duration-300 group-hover:opacity-90">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <div className="flex items-center gap-2 text-sm font-medium text-accent">
                <span>Read more</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12  border-opacity-20 text-center">
          <p className="text-sm font-light opacity-60">
            © 2024 Zheng Jiawen. Built with Next.js and Tailwind CSS.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <a
              href="github.com/ZhengJiawen44/tatsu"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 hover:text-[#2d5a3d] transition-all duration-300 text-sm"
            >
              GitHub
            </a>

            <a
              href="mailto:zhengjiawen44@gmail.com"
              className="opacity-60 hover:opacity-100 hover:text-[#2d5a3d] transition-all duration-300 text-sm"
            >
              Email
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogMainPage;
