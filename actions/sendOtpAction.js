"use server";

export async function sendOtpAction({ method, value }) {
  // You may want to get the endpoint from config or env
  const { otpConfig } = await import("@/lib/otpConfig");
  const methodConfig = otpConfig.methods.find(m => m.type === method);
  if (!methodConfig) return { success: false, message: "Invalid method" };

  try {
    const res = await fetch(methodConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": process.env.X_SIGNATURE || "", // keep it secret in server env
      },
      body: JSON.stringify({ method, value }),
    });

    console.log("sendOtpAction | JSON.stringify({ method, value }) => ", JSON.stringify({ method, value }));

    if (!res.ok) {
      return { success: false, message: "Failed to send OTP" };
    }

    const result = await res.json();

    console.log("sendOtpAction | result => ", result);

    if (!result?.success) {
      return { success: false, message: result?.message || "Failed to send OTP" };
    }
    return { success: true };
  } catch (e) {
    console.log("sendOtpAction | catch => ", e);
    return { success: false, message: "Failed to send OTP. Try again." };
  }
}