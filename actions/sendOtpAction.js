"use server";

import { serverFetch } from "@/utils/serverApi";

export async function sendOtpAction({ method, value }) {
  // You may want to get the endpoint from config or env
  const { otpConfig } = await import("@/lib/otpConfig");
  const methodConfig = otpConfig.methods.find(m => m.type === method);
  if (!methodConfig) return { success: false, message: "Invalid method" };

  try {
    const res = await serverFetch(methodConfig.endpoint, {
      method: "POST",
      body: JSON.stringify({ method, value }),
    });

    if (!res.ok) {
      console.error("sendOtpAction | response not ok => ", res.status);
      return { success: false, message: "Failed to send OTP" };
    }

    const result = await res.json();

    if (!result?.success) {
      return { 
        success: false, 
        message: result?.message || "Failed to send OTP", 
        cooldownRemaining: (result?.cooldownRemaining || 0) 
      };
    }

    return { 
      success: true, 
      message: result?.message || "Failed to send OTP", 
      cooldownRemaining: (result?.cooldownRemaining || 0)  
    };

  } catch (e) {
    console.error("sendOtpAction | catch => ", e);
    return { success: false, message: result?.message || "Failed to send OTP. Try again.", cooldownRemaining: (result?.cooldownRemaining || 0) };
  }
}