const API_BASE_URL = process?.env?.API_BASE_URL || process?.env?.NEXT_PUBLIC_BASE_URL || "";

export const otpConfig = {
  methods: [
    // Only include enabled methods
    { type: "email", label: "Email", endpoint: `${API_BASE_URL}/send-otp` },
    // { type: "phone", label: "Phone", endpoint: "https://dummyapi.com/send-phone-otp" },
  ],
  verifyEndpoint: "https://dummyapi.com/verify-otp",
}