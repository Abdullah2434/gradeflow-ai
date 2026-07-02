import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/assignments", "/review", "/insights"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return updateSession(request);
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
