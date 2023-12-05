import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  const { pathname, locale } = req.nextUrl;
  if (pathname === "/" && locale !== "en") {
    return NextResponse.redirect(new URL(`/${locale}/blog`, req.url));
  } else if (pathname === "/kr" && locale === "en") {
    return NextResponse.redirect(new URL(`/ko/blog`, req.url));
  }
}
