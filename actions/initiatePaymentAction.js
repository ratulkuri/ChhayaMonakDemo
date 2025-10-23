"use server";
import { redirect } from "next/navigation";

// export async function initiatePaymentAction(orderId) {
//   const API_BASE =
//     process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

//   try {
//     // const payRes = await fetch(`${API_BASE}/create-payment`, {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     "x-signature": process.env.X_SIGNATURE || "", // keep it secret in server env
//     //   },
//     //   body: JSON.stringify({ orderId }),
//     // });

//     // if (!payRes.ok) {
//     //   let problem = "Failed to initiate payment.";
//     //   try {
//     //     const j = await payRes.json();
//     //     problem = j?.message || problem;
//     //   } catch (_) {}
//     //   return { ok: false, message: problem };
//     // }

//     // const payData = await payRes.json();
//     // const paymentUrl =
//     //   payData?.url || payData?.payment_url || payData?.paymentLink;
//     // if (!paymentUrl) {
//     //   return { ok: false, message: "Payment link not returned by server." };
//     // }

//     if (!orderId) {
//       console.error("orderId => ", orderId);
//       return { ok: false, message: "Invalid transaction id." };  
//     }

//     const paymentUrl = `https://chhaya-payment.test/initiate/${orderId}`;

//     console.error("paymentUrl => ", paymentUrl);

//     redirect(paymentUrl);
//   } catch (err) {
//     if (err.digest?.startsWith("NEXT_REDIRECT")) return err;
//     console.error("initiatePaymentAction error", err);
//     return { ok: false, message: "Something went wrong. Please try again." };
//   }
// }
export async function initiatePaymentAction(orderId) {
  if (!orderId) {
    return { ok: false, message: "Invalid transaction id." };
  }

  const paymentUrl = `https://chhaya-payment.test/initiate/${orderId}`;
  console.info("Redirecting to:", paymentUrl);
  
  redirect(paymentUrl);
}