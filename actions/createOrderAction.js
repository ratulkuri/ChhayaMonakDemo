"use server";

import { serverFetch } from "@/utils/serverApi";

export async function createOrderAction(formData) {
  // Extract values using .get()
  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const dateOfBirth = formData.get("dateOfBirth")?.toString().trim();
  const packageJson = formData.get("packageJson");

  const fieldErrors = {};

  if (!fullName) fieldErrors.fullName = "Full name is required";
  if (!email) fieldErrors.email = "Email is required";
  if (!phone || !/^(?:\+?88)?01[3-9]\d{8}$/.test("+880" + phone)) fieldErrors.phone = "Invalid BD phone";
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
    phone: `0${phone}`,
    dob: dobFormatted,
    email: email,
    package: selectedPackage?.id,
    ...relationFlags
  };

  // Prepare API base (prefer server-only env var)
  const API_BASE =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

  try {
    // 1) Create order & user
    const purchaseRes = await serverFetch(`/purchase`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!purchaseRes.ok) {
      let problem = "Unable to create order.";
      try {
        const j = await purchaseRes?.json();
        problem = j?.message || problem;
      } catch (_) {}
      return { ok: false, message: problem };
    }

    const purchaseData = await purchaseRes.json();
    const orderId = purchaseData?.orderId || purchaseData?.id;
    const transactionId = purchaseData?.transactionId;
    if (!orderId) {
      return { ok: false, message: "Order created but no orderId returned." };
    }

    if (!transactionId) {
      return { ok: false, message: "Order created but no transactionId returned." };
    }

    // Return orderId for next step
    return { ok: true, orderId, transactionId };
  } catch (err) {
    console.error("createOrderAction error", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
