"use server";

import { serverFetch } from "@/utils/serverApi";

export async function checkEmailAction(email) {
  try {
    const res = await serverFetch('/email-check', {
      method: 'POST',
      body: JSON.stringify({ email }),
      cache: "no-store",
      // All headers (x-signature, Authorization) are now handled internally
    });
      console.error('checkEmailAction res : ', res);

    if (!res.ok) {
      return { ok: false, message: `Server returned ${res.status}` };
    }

    const data = await res.json();

    return { ok: true, exists: data?.exists, user: data?.user };
  } catch (err) {
      console.error('checkEmailAction exception : ', err);
    return { ok: false, message: err.message || "Phone check failed" };
  }
}