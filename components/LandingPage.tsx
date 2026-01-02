"use client";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-400 text-white text-center px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] opacity-20" />

        <h1 className="z-50 text-5xl font-extrabold mb-6">
          Sanity - The Ultimate Todo App
        </h1>
        <p className="z-50 text-lg max-w-2xl mb-8">
          A todo app for the not so sane — with a Notion-style editor,
          top-secret encrypted file uploads, and a bunch of nifty extras!
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="z-50">
            <Button className="px-6 py-3 text-lg font-semibold bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-200 transition">
              Login
            </Button>
          </Link>
          <Link href="/register" className="z-50">
            <Button className="px-6 py-3 text-lg font-semibold bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-200 transition">
              Register
            </Button>
          </Link>
        </div>
        <img
          src="/showcase2.png"
          className=" rounded-[10px] w-[1000px] h-auto shadow-2xl [transform:perspective(1000px)_rotateX(20deg)_rotateY(0deg)]"
        />
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;
