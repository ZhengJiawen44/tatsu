import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./app/auth";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|_vercel|.*\\..*).*)",
};
