const API_BASE_URL = process?.env?.API_BASE_URL || process?.env?.NEXT_PUBLIC_BASE_URL || "";

export const otpConfig = {
  methods: [
    // Only include enabled methods
    { type: "email", label: "Email", endpoint: `/send-otp` },
    // { type: "phone", label: "Phone", endpoint: `/send-otp` },
  ],
  verifyEndpoint: `/verify-otp`,
}