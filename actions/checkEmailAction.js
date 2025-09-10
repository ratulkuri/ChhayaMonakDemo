"use server";

export async function checkEmailAction(email) {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/email-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-signature": process.env.X_SIGNATURE || "", // keep it secret in server env
        },
        body: JSON.stringify({ email }),
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
