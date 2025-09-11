"use server";
import { redirect } from "next/navigation";

export async function initiatePaymentAction(orderId) {
  const API_BASE =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

  try {
    const payRes = await fetch(`${API_BASE}/create-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    if (!payRes.ok) {
      let problem = "Failed to initiate payment.";
      try {
        const j = await payRes.json();
        problem = j?.message || problem;
      } catch (_) {}
      return { ok: false, message: problem };
    }

    const payData = await payRes.json();
    const paymentUrl =
      payData?.url || payData?.payment_url || payData?.paymentLink;
    if (!paymentUrl) {
      return { ok: false, message: "Payment link not returned by server." };
    }

    redirect(paymentUrl);
  } catch (err) {
    console.error("initiatePaymentAction error", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}