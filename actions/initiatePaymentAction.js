"use server";
import { redirect } from "next/navigation";

const PAYMENT_BASE_URL = process.env.PAYMENT_BASE_URL || "https://chhaya-payment.test";

export async function initiatePaymentAction(orderId) {
  if (!orderId) {
    return { ok: false, message: "Invalid transaction id." };
  }

  const paymentUrl = `${PAYMENT_BASE_URL}/initiate/${orderId}`;
  console.info("Redirecting to:", paymentUrl);
  
  redirect(paymentUrl);
}