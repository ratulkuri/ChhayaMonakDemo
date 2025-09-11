"use server"

export async function verifyOtpAction({ method, value, otp }) {
  // Use fetch to call the verify endpoint (could be cross-domain)
  const res = await fetch(process.env.OTP_VERIFY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, value, otp }),
    credentials: "include",
  });
  if (!res.ok) return { ok: false, message: "OTP verification failed" };
  const data = await res.json();
  if (data.success) {
    // Optionally set verified_at or token in session/db here
    return { ok: true };
  }
  return { ok: false, message: data.message || "OTP verification failed" };
}