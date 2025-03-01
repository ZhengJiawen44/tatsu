import React from "react";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <ErrorBoundary
      fallback={
        <p className="text-red-500 text-center">
          Something went wrong, but don&apost worry, we sent an error report.
        </p>
      }
    >
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 text-white text-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">
          Tatsu - The Ultimate Todo App
        </h1>
        <p className="text-lg max-w-2xl mb-8">
          Supercharge your productivity with evolving avatars, long-term goal
          tracking, a Notion-like editor, encrypted file uploads, and more!
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button className="px-6 py-3 text-lg font-semibold bg-white text-indigo-700 rounded-lg shadow-md hover:bg-gray-200 transition">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="px-6 py-3 text-lg font-semibold bg-white text-indigo-700 rounded-lg shadow-md hover:bg-gray-200 transition">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;
