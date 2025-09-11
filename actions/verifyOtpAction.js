"use server"

export async function verifyOtpAction({ method, value, otp }) {
  const { otpConfig } = await import("@/lib/otpConfig");
  const methodConfig = otpConfig.methods.find(m => m.type === method);
  // Use fetch to call the verify endpoint (could be cross-domain)
  const verifyUrl = process.env.OTP_VERIFY_ENDPOINT || otpConfig?.verifyEndpoint;
  const res = await fetch(verifyUrl, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-signature": process.env.X_SIGNATURE || "", // keep it secret in server env
    },
    body: JSON.stringify({ method, value, otp }),
    credentials: "include",
  });
  if (!res.ok) return { ok: false, message: "OTP verification failed" };
  const data = await res?.json();
  if (data.success) {
    // Optionally set verified_at or token in session/db here
    return { ok: true };
  }
  return { ok: false, message: data.message || "OTP verification failed" };
}