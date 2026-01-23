import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br  px-4">
      <div className="text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-7xl font-bold ">404</h1>
          <div className="mt-2 h-1 w-24 mx-auto  rounded"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className=" mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/app/todo"
            className="px-6 py-3 border font-medium rounded-lg  transition-colors"
          >
            Go Back
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="mt-12">
          <p className="text-8xl text-muted-foreground font-bold">&gt;&lt;</p>
        </div>
      </div>
    </div>
  );
}
