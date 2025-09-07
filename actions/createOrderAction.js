"use server";

// import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createOrderAction(formData) {
  // Extract and basic sanitize
  // const formDatad = new FormData();
  // console.log(formData);
  // formData?.forEach(item => {console.log(item)});

  // return

  const fullName = (formData.get("fullName") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const dateOfBirth = (formData.get("dateOfBirth") || "").toString();
  const packageJson = formData.get("packageJson");

  // Server-side validation (mirror of client but authoritative)
  const fieldErrors = {};
  if (!fullName) fieldErrors.fullName = "Full name is required";
  if (!email) fieldErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "Invalid email";
  if (!phone) fieldErrors.phone = "Phone is required";
  else if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phone))
    fieldErrors.phone = "Invalid BD phone";
  if (!dateOfBirth) fieldErrors.dateOfBirth = "Date of birth is required";

  let selectedPackage = null;
  try {
    selectedPackage = packageJson ? JSON.parse(packageJson.toString()) : null;
  } catch (_) {}
  if (!selectedPackage?.id) {
    fieldErrors.package = "Package not found. Please reselect a plan.";
  }

  if (Object.keys(fieldErrors).length) {
    return {
      ok: false,
      message: "Please fix the errors and try again.",
      fieldErrors,
    };
  }

  // Build family relation flags
  // Convert date: "1995-05-04" → "1995-5-4"
  const dob = new Date(dateOfBirth);
  const dobFormatted = `${dob.getFullYear()}-${dob.getMonth() + 1}-${dob.getDate()}`;

  const relationKeys = ["spouse_1","spouse_2","child_1","child_2","child_3","parent_1","parent_2"];
  const relationFlags = relationKeys.reduce((acc, key) => {
    acc[key] = !!selectedPackage.relations?.some(r => r.relation === key);
    return acc;
  }, {});

  const payload = {
    name: fullName,
    phone: phone,
    dob: dobFormatted,
    email: email,
    package: selectedPackage?.id,
    ...relationFlags
  };

  // console.log(payload);

  // Prepare API base (prefer server-only env var)
  const API_BASE =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

  try {
    // 1) Create order & user
    const purchaseRes = await fetch(`${API_BASE}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Include any auth/trace cookies if your API needs them
      // credentials: "include", // not supported in node fetch; pass tokens explicitly if required
      body: JSON.stringify(payload),
      // Optionally, configure timeouts with AbortController (omitted for brevity)
    });

    if (!purchaseRes.ok) {
      let problem = "Unable to create order.";
      try {
        const j = await purchaseRes.json();
        problem = j?.message || problem;
      } catch (_) {}
      return { ok: false, message: problem };
    }

    const purchaseData = await purchaseRes.json();
    const orderId = purchaseData?.orderId || purchaseData?.id;
    if (!orderId) {
      return { ok: false, message: "Order created but no orderId returned." };
    }

    // 2) Initiate payment to get Stripe hosted link
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

    // Prefer redirect on the server for instant navigation and fewer client re-renders
    // If you prefer handling on client, return { ok: true, paymentUrl }
    redirect(paymentUrl);
  } catch (err) {
    console.error("createOrderAction error", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
