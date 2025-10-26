"use server";

import { serverFetch } from "@/utils/serverApi";

export async function checkPhoneAction(phone) {
  try {
    const res = await serverFetch(
      `/phone-check`,
      {
        method: "POST",
        body: JSON.stringify({ phone }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return { ok: false, message: `Server returned ${res.status}` };
    }
    
    const data = await res.json();

    return { ok: true, exists: data?.exists, user: data?.user };
  } catch (err) {
    return { ok: false, message: err.message || "Phone check failed" };
  }
}
