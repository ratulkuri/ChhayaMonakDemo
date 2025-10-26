"use server";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

export function setAuthCookies({ access, refresh }) {
  cookies().set(ACCESS_COOKIE, access, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });

  if (refresh) {
    cookies().set(REFRESH_COOKIE, refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}

export function clearAuthCookies() {
  cookies().delete(ACCESS_COOKIE);
  cookies().delete(REFRESH_COOKIE);
}

export function getAccessToken() {
  return cookies().get(ACCESS_COOKIE)?.value;
}
