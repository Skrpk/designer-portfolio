import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionValue,
} from "@/lib/auth";

function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = form.get("password");
  const target = safeNext(form.get("next"));

  const expected = process.env.PRIVATE_PROJECT_PASSWORD;

  if (!expected || typeof password !== "string" || password !== expected) {
    const url = new URL("/unlock", request.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(target, request.url), {
    status: 303,
  });

  response.cookies.set(SESSION_COOKIE, await createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
