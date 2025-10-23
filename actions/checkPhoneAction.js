"use server";

export async function checkPhoneAction(phone) {
  try {
    console.log("process.env.X_SIGNATURE => ", process.env.X_SIGNATURE)
    const res = await fetch(
      `${process.env.API_BASE_URL}/phone-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-signature": process.env.X_SIGNATURE || "", // keep it secret in server env
        },
        body: JSON.stringify({ phone }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.log(res);
      return { ok: false, message: `Server returned ${res.status}` };
    }
    
    const data = await res.json();
    
    console.log(res);
    
    return { ok: true, exists: data?.exists, user: data?.user };
  } catch (err) {
    return { ok: false, message: err.message || "Phone check failed" };
  }
}
