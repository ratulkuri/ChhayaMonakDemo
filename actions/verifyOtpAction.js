"use server"

import { serverFetch } from "@/utils/serverApi";

export async function verifyOtpAction({ method, sendTo, otp }) {
  const { otpConfig } = await import("@/lib/otpConfig");
  const methodConfig = otpConfig.methods.find(m => m.type === method);
  // Use fetch to call the verify endpoint (could be cross-domain)
  const verifyUrl = process.env.OTP_VERIFY_ENDPOINT || otpConfig?.verifyEndpoint;
  const res = await serverFetch(verifyUrl, {
    method: "POST",
    body: JSON.stringify({ method, sendTo, otp }),
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